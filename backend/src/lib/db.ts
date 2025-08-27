import { Client } from "pg";

export const client = new Client({
  host: 'localhost',
  port: 5434,
  database: 'postgres',
  user: 'postgres',
  password: 'password'
})
