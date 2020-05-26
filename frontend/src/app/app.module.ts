import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { WorkflowComponent } from "./workflow/workflow.component";
import { WorkflowItemComponent } from "./workflow/workflow-item/workflow-item.component";

@NgModule({
  declarations: [AppComponent, WorkflowComponent, WorkflowItemComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
