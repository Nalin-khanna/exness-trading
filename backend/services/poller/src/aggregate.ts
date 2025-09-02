import { pgclient } from "./lib/common";
export const setupContinousAggregate = async () => {
    // Create materialized view if not exists for 1 minute interval
    const intervals = [{label : '1m', bucket : '1 min' , refresh : '1 mins', start_offset : '1 hour'} , 
        {label : '5m', bucket : '5 min' , refresh : '5 mins'  , start_offset : '1 hour'}, 
        {label : '7m', bucket: '7 min', refresh : '7 mins' , start_offset : '1 hour'}, 
        {label : '1h', bucket : '1 hour' , refresh : '20 mins' , start_offset : '5 hour'}];

    for (let interval of intervals) {
        const createViewQuery = `
        CREATE MATERIALIZED VIEW IF NOT EXISTS trade_${interval.label} 
        WITH (timescaledb.continuous) AS
        SELECT time_bucket('${interval.bucket}', "time") AS bucket,
               symbol,
               first(price, time) AS open,
               max(price) AS high,
               min(price) AS low,
               last(price, time) AS close,
               sum(qty) AS volume
        FROM "stream_data"
        GROUP BY bucket, symbol;
        `;
        await pgclient.query(createViewQuery);
        console.log(`Continuous aggregate view for ${interval.label} created`);
    
        const addRefreshPolicyQuery = `
        SELECT add_continuous_aggregatze_policy('trade_${interval.label}',
            start_offset => INTERVAL '${interval.start_offset}',
            end_offset => INTERVAL '${interval.refresh}',
            schedule_interval => INTERVAL '${interval.refresh}');
        `
        await pgclient.query(addRefreshPolicyQuery);
        console.log(`Refresh policy for ${interval.label} set to ${interval.refresh}`);
    }
    
}