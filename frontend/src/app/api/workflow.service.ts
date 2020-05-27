import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
  providedIn: "root",
})
export class WorkflowService {
  constructor(private http: HttpClient) {}

  public save(workflow): Observable<any> {
    return this.http.post("http://localhost:3000/workflow/save", workflow);
  }

  public execute(workflow): Observable<any> {
    return this.http.post("http://localhost:3000/workflow/execute", workflow);
  }

  public list(): Observable<any> {
    return this.http.get("http://localhost:3000/workflow/list");
  }
}
