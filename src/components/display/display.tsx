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
	rating = INVALID;
	@observable
	reputation = INVALID;
	@observable
	hasBeenUpdated = false;
	@observable
	slotId = INVALID;
	@observable
	fetchrankedData: IRankedData[] = this.updateAvailableDrivers();

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);

	}
	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	@action
	private update = () => {
		this.slotId = r3e.data.DriverData[this.position].DriverInfo.SlotId;
		this.position = r3e.data.Position - 1;
		this.name = base64ToString(
			r3e.data.DriverData[this.position].DriverInfo.Name
		);
		this.id = this.fetchrankedData[this.slotId].UserId;
		this.urlProfileImage =
		`https://game.raceroom.com/game/user_avatar/${this.id}`;
		this.name = this.fetchrankedData[this.slotId].Fullname;
		this.rating = this.fetchrankedData[this.slotId].Rating;
		this.reputation = this.fetchrankedData[this.slotId].Reputation;
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
	this.getAllDriverData();
	return rankedDataInit;
}

	private async getAllDriverData(): Promise<any> {
		const url =
		'https://game.raceroom.com/multiplayer-rating/ratings.json';
		const newUserData: IRankedData[] = await (await fetch( url )).json();
		this.fetchrankedData[0] = await (newUserData
		[newUserData.findIndex((element) => element.UserId === 5823316)]);
	}

 render() {
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames(style.display, this.props.className, {
				})}
			>
				{/* Speed*/}
				<div className="variable">
					<p>{this}</p>
					<p>{this.id}</p>
					<p>{<img src={this.urlProfileImage} height="50px" />}</p>
					<p>{this.rating}</p>
					<p>{this.reputation}</p>
				</div>
			</div>
		);
	}
}
