var express = require("express");
var router = express.Router();
const { exec } = require("child_process");
const fs = require("fs");

let systemVariables = {};

const directionFlags = ["default", "true", "false"];

const workflowItems = {
	0: { type: 0 },
	1: { browser_action: "1", id: 1, type: "4", browser_link: "http://hrm.sps" },
	2: { web_element_action: "2", web_element_selector: "#txtUsername", id: 2, type: 1, web_element_fill_text_value: "cb_admin" },
	3: { web_element_action: "2", web_element_selector: "#txtPassword", id: 3, type: 1, web_element_fill_text_value: "12345" },
	4: { web_element_action: "3", web_element_selector: "#btnLogin", id: 4, type: "1" },
	5: { web_element_action: "1", web_element_selector: "#spanMessage", id: 5, type: 1 },
	6: { assign_variable_name: "$_message", assign_variable_value: "#_5", id: 6, type: "3" },
	7: { condition_operator: 1, condition_left: "$_message", condition_right: "Invalid credentials", id: 7, type: "2" },
	8: { assign_variable_name: "$_result", assign_variable_value: "false", id: 8, type: "3" },
	9: { assign_variable_name: "$_result", assign_variable_value: "true", id: 9, type: "3" },
	10: { assign_variable_name: "$_finalResult", assign_variable_value: "pass", id: 10, type: "3" },
	11: { assign_variable_name: "$_finalResult", assign_variable_value: "failed", id: 11, type: "3" },
};

const workflowGraph = {
	0: { 1: "default" },
	1: { 2: "default" },
	2: { 3: "default" },
	3: { 4: "default" },
	4: { 5: "default" },
	5: { 6: "default" },
	6: { 7: "default" },
	7: { 8: "false", 9: "true" },
	8: { 11: "default" },
	9: { 10: "default" },
};

const parseCodeFromWorkflowItem = function (item, parseTimes) {
	switch (parseInt(item.type)) {
		case 1:
			return parseTimes % 2 == 0 ? "" : parseWebElementCode(item) + "\r\n";
		case 2:
			return parseConditionCode(item, parseTimes) + "\r\n";
		case 3:
			return parseTimes % 2 == 0 ? "" : parseAssignCode(item) + "\r\n";
		case 4:
			return parseTimes % 2 == 0 ? "" : parseBrowserCode(item) + "\r\n";
		default:
			return "";
	}
};

const parseWebElementCode = function (item) {
	if (!item.web_element_selector || !item.web_element_action) {
		return "";
	}

	let result = "";

	systemVariables[`system_var_${item.id}`] = true;
	result += `let system_var_${item.id} = await driver.findElement(By.css('${item.web_element_selector}'))`;
	result += parseWebElementActionCode(item);

	return result + ";";
};
const parseWebElementActionCode = function (item) {
	switch (parseInt(item.web_element_action)) {
		case 1:
			return ".getText()";
		case 2:
			return !item.web_element_fill_text_value ? "" : `.sendKeys('${item.web_element_fill_text_value}')`;
		case 3:
			return ".click()";
		default:
			return "";
	}
};

const parseConditionCode = function (item, parseTimes) {
	if (!item.condition_left || !item.condition_right || !item.condition_operator) {
		return "";
	}

	if (parseTimes == 3) {
		return "}";
	}

	if (parseTimes == 2) {
		return "} else {";
	}

	const operator = parseConditionOperator(item.condition_operator);
	if (!operator) {
		return "";
	}

	const condition_left = parseDataWithType(item.condition_left);
	const condition_right = parseDataWithType(item.condition_right);

	return `if(${condition_left} ${operator} ${condition_right}) {`;
};
const parseConditionOperator = function (operatorCode) {
	switch (parseInt(operatorCode)) {
		case 1:
			return "==";
		case 2:
			return "!=";
		case 3:
			return ">";
		case 4:
			return ">=";
		case 5:
			return "<";
		case 6:
			return "<=";
		default:
			return "";
	}
};

const parseAssignCode = function (item) {
	if (!item.assign_variable_name || !item.assign_variable_value) {
		return "";
	}

	let assignName = item.assign_variable_name;
	if (isVariable(item.assign_variable_name)) {
		assignName = getVariableName(item.assign_variable_name);
	}

	let assignValue = parseDataWithType(item.assign_variable_value);
	return `${assignName} = ${assignValue};`;
};

const parseBrowserCode = function (item) {
	if (!item.browser_action) {
		return "";
	}

	if (item.browser_action == 1 && item.browser_link) {
		systemVariables[`system_var_${item.id}`] = true;
		return `let system_var_${item.id} = await driver.get("${item.browser_link}");`;
	}

	return "";
};

const isVariable = function (item) {
	if (item.indexOf("$_") == 0) {
		return true;
	}

	if (item.indexOf("#_") == 0) {
		return true;
	}

	return false;
};
const getVariableName = function (item) {
	if (item.indexOf("#_") == 0) {
		return "system_var_" + item.substring("#_".length, item.length);
	}

	return item.substring("$_".length, item.length);
};
const parseDataWithType = function (value) {
	if (isVariable(value)) {
		return getVariableName(value);
	}

	if (!isNaN) {
		return value;
	}

	return `"${value}"`;
};

/* GET users listing. */
router.post("/execute", function (req, res, next) {
	let content = "";
	let userDefinedVariables = {};

	let stack = [];
	let trackingGraph = {};
	let root = { key: 0, value: "start" };
	let node = root;

	const workflowItems = req.body.items;
	const workflowGraph = req.body.graph;

	for (let prop in workflowItems) {
		if (typeof workflowItems[prop] != "object" || workflowItems[prop].type != 3) {
			continue;
		}

		if (!isVariable(workflowItems[prop].assign_variable_name)) {
			continue;
		}

		const variableName = getVariableName(workflowItems[prop].assign_variable_name);
		if (userDefinedVariables.hasOwnProperty(variableName)) {
			continue;
		}

		userDefinedVariables[variableName] = true;
		content += `let ${variableName};\r\n`;
	}

	while (true) {
		if (!trackingGraph.hasOwnProperty(node.key)) {
			trackingGraph[node.key] = 0;
		}

		trackingGraph[node.key]++;
		content += parseCodeFromWorkflowItem(workflowItems[node.key], trackingGraph[node.key]);

		if (workflowGraph.hasOwnProperty(node.key)) {
			let hasUnreadChildNode = false;
			const nodeChildren = Object.keys(workflowGraph[node.key]);

			for (let i = 0; i < directionFlags.length; i++) {
				for (let j = 0; j < nodeChildren.length; j++) {
					if (workflowGraph[node.key][nodeChildren[j]] != directionFlags[i]) {
						continue;
					}

					let maxApprovedTimes = 1;
					if (workflowGraph.hasOwnProperty(nodeChildren[j])) {
						maxApprovedTimes = Object.keys(workflowGraph[nodeChildren[j]]).length * 2;

						if (Object.keys(workflowGraph[nodeChildren[j]]).length > 1) {
							maxApprovedTimes--;
						}
					}

					if (trackingGraph[nodeChildren[j]] >= maxApprovedTimes) {
						break;
					}

					stack.push(node);
					node = { key: nodeChildren[j], value: workflowGraph[node.key][nodeChildren[j]] };
					hasUnreadChildNode = true;
					break;
				}

				if (hasUnreadChildNode) {
					break;
				}
			}

			if (hasUnreadChildNode) {
				continue;
			}
		}

		node = stack.pop();

		if (node.key == 0) {
			break;
		}
	}

	fs.readFile("template.js", "utf8", function (err, data) {
		if (err) {
			console.log(err);
			return res.status(200).send();
		}

		console.log(data);

		let testContent = data;
		testContent = testContent.replace("{{--content--}}", content);
		fs.writeFile("test.js", testContent, function (err) {
			if (err) {
				console.log(err);
				return res.status(200).send();
			}

			exec("mocha --recursive --timeout 10000 test.js", (err, stdout, stderr) => {
				if (err) {
					console.log(err);
					return;
				}

				console.log(`stdout: ${stdout}`);
				console.log(`stderr: ${stderr}`);
			});

			console.log(content);
			res.status(200).send();
		});
	});

	// cd c:\\xampp\\htdocs\\2_Learning_Project\\nodejs\\workflow-js-backend
});

module.exports = router;
