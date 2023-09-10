
import r3e from './r3e';

export let userData: IRankedData[] = [];

interface IRankedData {
	UserId: number;
	Username: string;
	Fullname: string;
	Rating: number;
	ActivityPoints: number;
	RacesCompleted: number;
	Reputation: number;
	Country: string;
	Team: string;
	Position: number;
}

/*async function updateEntry(position: number): Promise<void> {
	userData[position] = await
	getDriverData(r3e.data.DriverData[position].DriverInfo.UserId);
}*/

async function updateAvailableDrivers(): Promise<void> {
	for (let index = 0; index < 35; index++) {
		(userData.length < (index + 1)
		&& r3e.data.DriverData.length < (index + 1) ?
		userData[index] =
		await getDriverData(r3e.data.DriverData[index].DriverInfo.UserId)
		: userData[index] = {
			UserId: -1,
			Username: '',
			Fullname: '',
			Rating: -1,
			ActivityPoints: -1,
			RacesCompleted: -1,
			Reputation: -1,
			Country: '',
			Team: '',
			Position: -1}
		);
	}
}

updateAvailableDrivers();

async function getDriverData(userId: number): Promise<any> {
	const url = `https://game.raceroom.com/multiplayer-rating/user/${userId}.json`;
	alert(url);
	const newUserData = await (await fetch
		(url)
	).json();
	return newUserData;
}
