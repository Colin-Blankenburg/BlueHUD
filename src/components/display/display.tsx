import {
	classNames,
	INVALID,
	widgetSettings,
	base64ToString
} from '../../lib/utils';
import { action, observable } from 'mobx';
import { IWidgetSetting } from '../app/app';
import { observer } from 'mobx-react';
import r3e, { registerUpdate, unregisterUpdate } from '../../lib/r3e';
import React from 'react';
import style from './display.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

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
@observer
export default class Display extends React.Component<IProps, {}> {
	@observable
	position = r3e.data.Position - 1;
	@observable
	id = INVALID;
	@observable
	urlProfileImage = '';
	@observable
	name = '';
	@observable
	hasBeenUpdated = false;
	@observable
	slotId = INVALID;
	@observable
	rankedData: IRankedData[] = this.updateAvailableDrivers();

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);

	}
	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	@action
	private update = () => {
		this.position = r3e.data.Position - 1;
		this.name = base64ToString(
			r3e.data.DriverData[this.position].DriverInfo.Name
		);
		this.id = r3e.data.DriverData[this.position].DriverInfo.UserId;
		this.urlProfileImage =
		`https://game.raceroom.com/game/user_avatar/${this.id}`;
		this.slotId = r3e.data.DriverData[this.position].DriverInfo.SlotId;
		this.name = this.rankedData[this.slotId].Fullname;
	};

 private updateAvailableDrivers(): IRankedData[] {
	const rankedDataInit: IRankedData[] = [];
	const basicInfo: IRankedData = {
		UserId: -1,
		Username: '-',
		Fullname: '-',
		Rating: 1500,
		ActivityPoints: 5,
		RacesCompleted: 1,
		Reputation: 70,
		Country: '-',
		Team: '-',
		Position: 1
	};
	for (let slotId = 0; slotId < r3e.data.NumCars; slotId++) {
			rankedDataInit[slotId] = basicInfo;
		}
	// this.getAllDriverData();
	return rankedDataInit;
}
/*
 private async getAllDriverData(): Promise<any> {
	for (let slotId = 0; slotId < r3e.data.NumCars ; slotId++) {
		const userId =
		r3e.data.DriverData[this.getSlotPosition(slotId)].DriverInfo.UserId;
		const url =
		`https://game.raceroom.com/multiplayer-rating/user/${userId}.json`;
		const newUserData = await (await fetch
			(url)
		).json();
		this.rankedData[slotId] = newUserData;
	}
}

 private getSlotPosition(slotId: number): number {
	let pos = -1;
	for (let position = 0; position < r3e.data.NumCars - 1; position++) {
		if (r3e.data.DriverData[position].DriverInfo.SlotId === slotId) {
		pos = position;
		}
	}
	return pos;
 }
*/
 render() {
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames(style.display, this.props.className, {
				})}
			>
				{/* Speed*/}
				<div className="variable">
					<p>{this.name}</p>
					<p>{this.id}</p>
					<p>{<img src={this.urlProfileImage} height="50px" />}</p>
					<p>{this.name}</p>
				</div>
			</div>
		);
	}
}
