import json

lines = open('./linesWithStopPoints.json')
stops = open('./stopPointNumbersWithNames.json')

parsedLines = json.loads(lines.read())
parsedStops = json.loads(stops.read())


newJsons = list()

for line in parsedLines:
    stopList = list()
    for stop in parsedStops :
        if stop["Number"] in line["stops"]:
            if (stop["Name"] not in stopList):
                stopList.append(stop["Name"])
    newJsons.append({"line": line["line"], "stops": stopList})

x = json.dump(newJsons, open("LinesWithStops.json", mode='x'))
