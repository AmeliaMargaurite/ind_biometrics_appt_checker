const list = {
	IND_Amsterdam:
		"https://oap.ind.nl/oap/api/desks/AM/slots/?productKey=BIO&persons=1",
	IND_Den_Haag:
		"https://oap.ind.nl/oap/api/desks/DH/slots/?productKey=BIO&persons=1",
	IND_Zwolle:
		"https://oap.ind.nl/oap/api/desks/ZW/slots/?productKey=BIO&persons=1",
	IND_Den_Bosch:
		"https://oap.ind.nl/oap/api/desks/DB/slots/?productKey=BIO&persons=1",
	IND_Haarlem:
		"https://oap.ind.nl/oap/api/desks/6b425ff9f87de136a36b813cccf26e23/slots/?productKey=BIO&persons=1",
	Expat_Groningen:
		"https://oap.ind.nl/oap/api/desks/0c127eb6d9fe1ced413d2112305e75f6/slots/?productKey=BIO&persons=1",
	Expat_Maastricht:
		"https://oap.ind.nl/oap/api/desks/6c5280823686521552efe85094e607cf/slots/?productKey=BIO&persons=1",
	Expat_Wageningen:
		"https://oap.ind.nl/oap/api/desks/b084907207cfeea941cd9698821fd894/slots/?productKey=BIO&persons=1",
	Expat_Eindhoven:
		"https://oap.ind.nl/oap/api/desks/0588ef4088c08f53294eb60bab55c81e/slots/?productKey=BIO&persons=1",
	Expat_Den_Haag:
		"https://oap.ind.nl/oap/api/desks/5e325f444aeb56bb0270a61b4a0403eb/slots/?productKey=BIO&persons=1",
	Expat_Rotterdam:
		"https://oap.ind.nl/oap/api/desks/f0ef3c8f0973875936329d713a68c5f3/slots/?productKey=BIO&persons=1",
	Expat_Enschede:
		"https://oap.ind.nl/oap/api/desks/3535aca0fb9a2e8e8015f768fb3fa69d/slots/?productKey=BIO&persons=1",
	Expat_Utrecht:
		"https://oap.ind.nl/oap/api/desks/fa24ccf0acbc76a7793765937eaee440/slots/?productKey=BIO&persons=1",
	Expat_Amsterdam:
		"https://oap.ind.nl/oap/api/desks/284b189314071dcd571df5bb262a31db/slots/?productKey=BIO&persons=1",
};

const fetchData = async (url) => {
	let body = "{";
	const response = await fetch(url, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	}).then((resp) => resp.text());
	const parts = response.split(')]}\',\n{"status":"OK",');
	return JSON.parse((body += parts[1])).data;
};

const requestAllSortedData = async () => {
	const allData = [];

	for (let key in list) {
		const url = list[key];
		const location = key.split("_").join(" ");
		const respData = await fetchData(url);
		respData.forEach((data) => {
			allData.push({
				location: key,
				date: new Date(data.date),
				startTime: data.startTime,
			});
		});
	}

	allData.sort((a, b) => Number(a.date) - Number(b.date));
	return [allData[0], allData[1], allData[2]];
};

// const data = await requestAllSortedData();
