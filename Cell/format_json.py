import json


def pretty_format(fp):
	with open(fp, "r", encoding = "utf-8") as file:
		data = json.loads(file.read())

	with open(fp, "w+", encoding = "utf-8") as file:
		file.write(json.dumps(data, indent = 2))


if __name__ == "__main__":
	pretty_format("field.json")
