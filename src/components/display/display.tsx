import {
	classNames,
	INVALID,
	widgetSettings,
	formatTime
} from '../../lib/utils';
import { action, observable } from 'mobx';
import { ITireData } from './../../types/r3eTypes';
import { IWidgetSetting } from '../app/app';
import { observer } from 'mobx-react';
import r3e, { registerUpdate, unregisterUpdate } from '../../lib/r3e';
import React from 'react';
import style from './display.scss';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}
interface IDriverData {
	LapDistance: number;
	Completedlaps: number;
}
@observer
export default class Display extends React.Component<IProps, {}> {
	@observable
	rideHeight: ITireData<number> = {
		FrontLeft: 0,
		FrontRight: 0,
		RearLeft: 0,
		RearRight: 0
	};
	@observable
	driverData: IDriverData[] = [];
	@observable
	lapsLeft = INVALID;
	@observable
	timeLeft = INVALID;
	@observable
	incPoints = INVALID;
	@observable
	incPointsMax = INVALID;
	@observable
	lastLapTime = '';
	@observable
	bestLapTime = '';
	leaderLapDistance: any;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);

	}
	componentWillUnmount() {
		unregisterUpdate(this.update);
	}
	@action
	private update = () => {
		this.lapsLeft = r3e.data.FuelLeft / r3e.data.FuelPerLap;
		this.rideHeight = r3e.data.Player.RideHeight;
		this.timeLeft = this.lapsLeft * r3e.data.LapTimeBestSelf;
		this.lastLapTime = formatTime(r3e.data.LapTimePreviousSelf, 'm:ss.SSS');
		this.bestLapTime = formatTime(r3e.data.LapTimeBestSelf, 'm:ss.SSS');
		this.incPoints = r3e.data.IncidentPoints;
		this.incPointsMax = r3e.data.MaxIncidentPoints;
		this.leaderLapDistance = r3e.data.DriverData[0].CompletedLaps;

	};

	render() {
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames(style.display, this.props.className, {
					shouldShow: this.lapsLeft !== INVALID
				})}
			>
				{/* Speed*/}
				<div className="variable">
					<p>{
					this.leaderLapDistance}</p>
					<p>{
					this.bestLapTime
					}</p>
					{this.incPoints} / {this.incPointsMax}
				</div>
			</div>
		);
	}
}
