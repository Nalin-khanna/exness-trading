import { Client } from "pg";
export const pgclient = new Client({
  host: 'localhost',
  port: 5434,
  database: 'postgres',
  user: 'postgres',
  password: 'password'
})