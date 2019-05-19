export default interface Project {
  root: string;
  files: { [path: string]: string };
}
