export enum JobDefinitions {
  Crow = "job-futurehouse-paperqa2",
  Falcon = "job-futurehouse-paperqa2-deep",
  Owl = "job-futurehouse-hasanyone",
  Phoenix = "job-futurehouse-phoenix",
}

export type JobRequest = {
  name: JobDefinitions;
  query: string;
  runtimeConfig?: object; // optional
};
