export interface Message {
  id: number;
  src: string;
  dst: string;
  data: string;
  event: string;
  retry: number;
  last_retry: string;
  created_at: string;
}
