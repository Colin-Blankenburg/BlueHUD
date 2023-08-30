import {
	classNames,
	widgetSettings,
	formatTime,
	countIsIncreasing,
	INVALID
} from './../../lib/utils';
import { action, observable} from 'mobx';
import { IWidgetSetting } from '../app/app';
import { observer } from 'mobx-react';
import r3e, { registerUpdate, unregisterUpdate } from '../../lib/r3e';
import React from 'react';
import style from './fuel.scss';
interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
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
	completedLaps = INVALID;
	@observable
	leaderFinish = INVALID;
	@observable
	fuelTimeLeft = INVALID;
	@observable
	lapsLeft = INVALID;
	@observable
	format = '';
	fuel0LapsAgo = INVALID;
	fuel1LapsAgo = INVALID;
	@observable
	leaderLapDistance = INVALID;
	@observable
	leaderCompletedLaps = INVALID;
	@observable
	position = INVALID;
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
		this.position = r3e.data.Position;
		this.completedLaps = r3e.data.CompletedLaps;
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
		this.leaderCompletedLaps = r3e.data.DriverData[0].CompletedLaps;
		this.leaderFinish = r3e.data.DriverData[0].FinishStatus;
		this.leaderLapDistance = r3e.data.DriverData[0].LapDistance;
		this.fuelEstimated = this.lapsToFinish() * this.fuelPerLap;
		this.delta = this.fuelEstimated - this.fuelLeft;
	};

	private lapsToFinish() {
		const fraction = r3e.data.LapDistanceFraction ===
		-1 ? 0 : r3e.data.LapDistanceFraction;
		const leaderFraction = this.position === 1 ? fraction :
		this.leaderLapDistance / r3e.data.LayoutLength;
		let leaderLapsLeft: any;
		if (this.leaderFinish === 1) {
			return 1 - fraction;
		}
		if (this.timeLeft !== -1) {
			let referenceTime: any;
			const leaderBestLap = r3e.data.LapTimeBestLeader;
			const bestLap = r3e.data.LapTimeBestSelf;
			if (leaderBestLap > 0 && this.leaderCompletedLaps > 1) {
				referenceTime = leaderBestLap;
			} else if (bestLap > 0 && this.completedLaps) {
				referenceTime = bestLap;
			}
			leaderLapsLeft = Math.ceil(this.timeLeft / referenceTime + leaderFraction);
			if (this.position === 1) {
				return leaderLapsLeft - fraction;
			}
			if (this.completedLaps === this.leaderCompletedLaps) {
				return (leaderLapsLeft - fraction);
			}
			return leaderLapsLeft + 1 - fraction;
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

/*	private lapsToFinish() {
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
*/
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
							{this.lapsToFinish() >= 0 ? this.fuelEstimated.toFixed(1) : '--'}
							{('L')}
						</div>
						<div className="lapsLeft">
							{('Laps left: ')}
							{this.lapsLeft.toFixed(2)}
							{(' laps')}
						</div>
						<div className="lapsEstimated">
							{('Laps Est: ')}
							{this.lapsToFinish() >= 0 ? this.lapsToFinish().toFixed(2) : '--'}
							{(' laps')}
						</div>
						<div className="timeLeft">
							{('Time left: ')}
							{r3e.data.LapTimeBestSelf === -1 ? '--:--.-' :
							 formatTime(this.fuelTimeLeft, this.format)}
						</div>
						<div
							 className={classNames('delta', {
								deltaBad: this.delta > 0,
								deltaGood: this.delta < 0
							})}
						>
							{('Delta: ')}
							{this.lapsToFinish() >= 0 ? this.delta.toFixed(2) : '--'}
							{('L')}
						</div>
					</div>
				)}
			</div>
		);
	}
}
