import services.bi as bi
import datetime

result = bi.getChartData("2009-07-05 11:04:35","2022-07-05 11:04:35","cr_b",["bloc","it_s"])
print(result)