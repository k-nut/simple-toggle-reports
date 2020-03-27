export interface Entry {
  id: number;
  pid: number;
  tid: number;
  uid: number;
  description: string;
  start: string;
  end: string;
  updated: string;
  dur: number;
  user: string;
  use_stop: boolean;
  client: string;
  project: string;
  project_color: string;
  project_hex_color: string;
  task: null;
  billable: null;
  is_billable: boolean;
  cur: null;
  tags: any[];
}

export interface Response {
  total_grand: number;
  total_billable: null;
  total_currencies: any[];
  total_count: number;
  per_page: number;
  data: Entry[];
}
