
import r3e, {} from './r3e';

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

export let rankedData: IRankedData[] = updateAvailableDrivers();

function updateAvailableDrivers(): IRankedData[] {
	const rankedDataInit: IRankedData[] = [];
	for (let slotId = 0; slotId < r3e.data.NumCars; slotId++) {
			rankedDataInit[slotId] = {
				UserId: 5823316,
				Username: 'BluePANDA2334',
				Fullname: 'Colin Blankenburg',
				Rating: 2182.412,
				ActivityPoints: 5,
				RacesCompleted: 362,
				Reputation: 97.492,
				Country: 'DE',
				Team: 'RR shenanigans',
				Position: 15
			};
		}
	return rankedDataInit;
	// getDriverData();
}
/*
async function getDriverData(slotId: number): Promise<any> {
	const userId = r3e.data.DriverData[getSlotPosition(slotId)].DriverInfo.UserId;
	const url = `https://game.raceroom.com/multiplayer-rating/user/${userId}.json`;
	const newUserData = await (await fetch
		(url)
	).json();
	rankedData[slotId] = newUserData;
}

function getSlotPosition(slotId: number): number {
	let pos = -1;
	for (let position = 0; position < r3e.data.NumCars - 1; position++) {
		if (r3e.data.DriverData[position].DriverInfo.SlotId === slotId) {
		pos = position;
		}
	}
	return pos;
}
*/
