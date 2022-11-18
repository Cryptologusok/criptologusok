import duckdb
import pandas as pd
import datetime

con = duckdb.connect()
pd_data_main = pd.read_parquet('1.parquet')
pd_data_aggr = pd.read_parquet('2.parquet')

# rename columns
nameDictmain = {
    "bloc" : "blockid",
    "time" : "time",
    "it_s" : "input_total_satoshi",
    "ft_s" : "fee_total_satoshi",
    "cr_b" : "currency_rate_bitcoin",
    "size" : "size",
    "inpc" : "input_count",
    "outc" : "output_count",
    "trnr" : "transaction_number"
}

nameDictagg = {
    "bloc" : "blockid",
    "trnr" : "transaction_number"
}
pd_data_main=pd_data_main.rename(columns=nameDictmain)
pd_data_aggr=pd_data_aggr.rename(columns=nameDictagg)

def getData(startDate,endDate,xaxis,yaxis):
#SUBQUERY
  #splitting up yaxis for subquery
  subQuerySelectColumns = xaxis
  for y in yaxis:
    subQuerySelectColumns = subQuerySelectColumns + ',' + y
  #generating subquery_main
  subQuery =  "SELECT " + subQuerySelectColumns + ", transaction_number , NTILE(100) OVER (ORDER BY " + xaxis + " asc) bucket"
  subQuery += " FROM pd_data_main main "
  subQuery += " JOIN pd_data_aggr aggr USING(blockid) "
  subQuery += " where main.time > TIMESTAMP '" + startDate + "' and main.time < TIMESTAMP '" + endDate + "'"
  
#MAINQUERY
  #getting x axis
  mainQuerySelectColumns = ' AVG(CAST(' + xaxis + ' AS BIGINT)) AS ' + xaxis 
  if xaxis == 'time':
  #if its the time column then the calculation: min + ((max - min) / 2)  
    mainQuerySelectColumns = ' CAST (MIN(CAST(' + xaxis + ' AS DATETIME)) + ((MAX(CAST(' + xaxis + ' AS DATETIME)) - MIN(CAST(' + xaxis + ' AS DATETIME))) / 2) AS VARCHAR) AS ' + xaxis 
  #splitting up yaxis for mainquery
  for y in yaxis:
    mainQuerySelectColumns = mainQuerySelectColumns + ',' + ' AVG(CAST(' + y + ' AS BIGINT)) AS ' + y
  #generating mainquery
  mainQuery = " SELECT bucket," + mainQuerySelectColumns + ", AVG(transaction_number) AS transaction_number "
  mainQuery += " FROM ( " + subQuery + " )  GROUP BY bucket "

  #print(mainQuery)
  #execute query and return
  result = con.execute(mainQuery).fetchall()

  return (result)