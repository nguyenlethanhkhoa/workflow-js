import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WorkflowComponent } from "./workflow/workflow.component";

const routes: Routes = [
  { path: "workflow", component: WorkflowComponent },
  { path: "", redirectTo: "workflow", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
