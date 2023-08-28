import {
	classNames,
	widgetSettings,
	formatTime,
	countIsIncreasing,
	INVALID
} from './../../lib/utils';
import { action, observable} from 'mobx';
import { IDriverData } from './../../types/r3eTypes';
import { IWidgetSetting } from '../app/app';
import { observer } from 'mobx-react';
import r3e, { registerUpdate, unregisterUpdate } from '../../lib/r3e';
import React from 'react';
import style from './fuel.scss';
interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}
interface IDriverInfo {
	meta: IDriverData;
}
@observer
export default class Fuel extends React.Component<IProps, {}> {
	@observable
	fuelPerLap = INVALID;
	@observable
	fuelLastLap = '';
	@observable
	fuelLeft = INVALID;
	@observable
	timeLeft = INVALID;
	@observable
	fuelCapacity = INVALID;
	@observable
	fuelEstimated = INVALID;
	@observable
	fuelUseActive = INVALID;
	@observable
	fuelTimeLeft = INVALID;
	@observable
	lapsLeft = INVALID;
	@observable
	format = '';
	fuel0LapsAgo = INVALID;
	fuel1LapsAgo = INVALID;
	@observable
	driversData: IDriverInfo[] = [];
	@observable
	leaderLapDistance = INVALID;
	@observable
	leaderCompletedLaps = INVALID;
	@observable
	delta = INVALID;
	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);
	}

	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	@action
	private update = () => {
		this.fuelPerLap = r3e.data.FuelPerLap;
		this.fuelUseActive = r3e.data.FuelUseActive;
		this.fuelLeft = r3e.data.FuelLeft;
		this.timeLeft = r3e.data.SessionTimeRemaining;
		this.fuelCapacity = r3e.data.FuelCapacity;
		this.fuelTimeLeft = this.lapsLeft * r3e.data.LapTimeBestSelf;
		this.lapsLeft = r3e.data.FuelLeft / r3e.data.FuelPerLap;
		this.format = this.fuelTimeLeft < 3600 ? 'm:s.S' : 'h:m:s.S';
		this.fuelLastLap =
		this.lapStartFuelLevel(1)
		- this.lapStartFuelLevel(0) <= 0 ?
			 '--' :
			(this.lapStartFuelLevel(1)
			- this.lapStartFuelLevel(0)).toFixed(2);
		this.getLeaderData;
		this.fuelEstimated = this.lapsToFinish() * this.fuelPerLap;
		this.delta = this.fuelEstimated - this.fuelLeft;
	};

	private lapsToFinish() {
		const fraction = r3e.data.LapDistanceFraction ===
		 -1 ? 0 : r3e.data.LapDistanceFraction;
		if (this.timeLeft !== 0 ) {
			let referenceTime: any;
			const leaderBestLap = r3e.data.LapTimeBestLeader;
			const bestLap = r3e.data.LapTimeBestSelf;
			if (leaderBestLap > 0 ) {
				referenceTime = leaderBestLap;
			} else if (bestLap > 0) {
				referenceTime = bestLap;
			}
			return Math.ceil(this.timeLeft / referenceTime + this.leaderLapDistance)
					- fraction + (this.leaderLapDistance < fraction ? 1 : 0) +
					(r3e.data.SessionLengthFormat === 2 ? 1 : 0);
		}
		const laps = r3e.data.NumberOfLaps;
		if (laps === -1) {
			return -1;
		}
		if (this.leaderCompletedLaps === -1) {
			return -1;
		}
		return laps - this.leaderCompletedLaps - fraction;
	}

	private getLeaderData(drivers: IDriverInfo[]) {
		const leader = drivers[0];
		this.leaderLapDistance = leader.meta.LapDistance;
		this.leaderCompletedLaps = leader.meta.CompletedLaps;
		}

	private lapStartFuelLevel(lap: number) {
		const completedLaps = r3e.data.CompletedLaps;
		if (countIsIncreasing(completedLaps)) {
			this.fuel1LapsAgo = this.fuel0LapsAgo;
			this.fuel0LapsAgo = this.fuelLeft;
		}
		if (lap === 0) {
			return this.fuel0LapsAgo;
		}
		return this.fuel1LapsAgo;
	}

	render() {
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames(style.fuel, this.props.className)}
			>
				{!!this.fuelUseActive && (
					<div>
						<div className="fuelPerLap">
							{('Fuel per lap: ')}
							{this.fuelPerLap.toFixed(2)}
							{('L')}
						</div>
						<div className="fuelLastLap">
							{('Fuel last lap: ')}
							{this.fuelLastLap}
							{('L')}
						</div>
						<div className="fuelRemaining">
							{('Fuel left: ')}
							{this.fuelLeft.toFixed(1)}
							{('L')}
						</div>
						<div className="fuelEstimated">
							{('Fuel Est: ')}
							{this.fuelEstimated.toFixed(1)}
							{('L')}
						</div>
						<div className="lapsLeft">
							{('Laps left: ')}
							{this.lapsLeft.toFixed(2)}
							{(' laps')}
						</div>
						<div className="lapsEstimated">
							{('Laps Est: ')}
							{this.lapsToFinish().toFixed(2)}
							{(' laps')}
						</div>
						<div className="timeLeft">
							{('Time left: ')}
							{r3e.data.LapTimeBestSelf === -1 ? '--:--.-' :
							 formatTime(this.fuelTimeLeft, this.format)}
						</div>
						<div className="delta">
							{('Delta: ')}
							{this.delta.toFixed(2)}
							{('L')}
						</div>
					</div>
				)}
			</div>
		);
	}
}
