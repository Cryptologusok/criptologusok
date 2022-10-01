import duckdb
import pandas as pd
import datetime

con = duckdb.connect()
pd_data = pd.read_parquet('input_single_json.parquet')

# def getMaxMin(startDate,endDate,reqCol):
#   #generate query
#   queryStr =  "SELECT MIN(" + reqCol + ") , MAX(" + reqCol + ") "
#   queryStr += " FROM pd_data where time > TIMESTAMP '" + startDate + "' and time < TIMESTAMP '" + endDate + "'"
#   result = con.execute(queryStr).fetchone()
#   return  ('{"minValue":' + str(result[0]) + ',"maxValue:"' + str(result[1]) + '}')

def getData(startDate,endDate,xaxis,yaxis):
  #splitting up yaxis for subquery
  subQuerySelectColumns = xaxis
  for y in yaxis:
    subQuerySelectColumns = subQuerySelectColumns + ',' + y
  #generating subquery
  subQuery =  "SELECT " + subQuerySelectColumns
  subQuery += " , NTILE(100) OVER (ORDER BY " + xaxis + " asc) bucket"
  subQuery += " FROM pd_data where time > TIMESTAMP '" + startDate + "' and time < TIMESTAMP '" + endDate + "'"
  #splitting up yaxis for mainquery
  mainQuerySelectColumns = ' AVG(CAST(' + xaxis + ' AS BIGINT)) AS ' + xaxis 
  for y in yaxis:
    mainQuerySelectColumns = mainQuerySelectColumns + ',' + ' AVG(CAST(' + y + ' AS BIGINT)) AS ' + y
  #generating mainquery
  mainQuery = " SELECT bucket," + mainQuerySelectColumns
  mainQuery += " FROM ( " + subQuery + " ) "
  mainQuery += " GROUP BY bucket "
  #execute query and return
  #result = con.execute(mainQuery).fetchall()
  result = con.execute(mainQuery).fetchall()
  return (result)

result = getData("2009-07-05 11:04:35","2022-07-05 11:04:35","cr_b",["bloc","it_s"])
print(result)