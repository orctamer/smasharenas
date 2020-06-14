const data = [
	{
		user: "effy",
		character: "banjo",
		image: "banjo.jpg",
	},
	{
		user: "bob",
		character: "mario",
		image: "mario.jpg",
	},
];

let checkUser = data.find(x => x.user == "effy");

console.log(checkUser);