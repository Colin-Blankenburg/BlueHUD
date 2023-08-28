import {
	classNames,
	widgetSettings,
	lerpColor,
	INVALID
} from './../../lib/utils';
import { action, observable } from 'mobx';
import { ITireData, ITireTemp, IBrakeTemp } from './../../types/r3eTypes';
import { IWidgetSetting } from '../app/app';
import { observer } from 'mobx-react';
import r3e, { registerUpdate, unregisterUpdate } from '../../lib/r3e';
import React from 'react';
import style from './tires.scss';
interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Tires extends React.Component<IProps, {}> {
	@observable
	sessionType = -1;

	@observable
	tireWear: ITireData<number> = {
		FrontLeft: 0,
		FrontRight: 0,
		RearLeft: 0,
		RearRight: 0
	};

	@observable
	tireDirt: ITireData<number> = {
		FrontLeft: 0,
		FrontRight: 0,
		RearLeft: 0,
		RearRight: 0
	};

	@observable
	tirePressure: ITireData<number> = {
		FrontLeft: 0,
		FrontRight: 0,
		RearLeft: 0,
		RearRight: 0
	};

	@observable
	tireTemp: ITireData<ITireTemp> = {
		FrontLeft: {
			CurrentTemp: {
				Left: INVALID,
				Center: INVALID,
				Right: INVALID
			},
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		},
		FrontRight: {
			CurrentTemp: {
				Left: INVALID,
				Center: INVALID,
				Right: INVALID
			},
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		},
		RearLeft: {
			CurrentTemp: {
				Left: INVALID,
				Center: INVALID,
				Right: INVALID
			},
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		},
		RearRight: {
			CurrentTemp: {
				Left: INVALID,
				Center: INVALID,
				Right: INVALID
			},
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		}
	};

	// individual tire wear variables **WITHOUT @OBSERVABLE!**
	wear0LapsAgo = {
		frontLeft: INVALID,
		frontRight: INVALID,
		rearLeft: INVALID,
		rearRight: INVALID
	};

	wear1LapsAgo = {
		frontLeft: INVALID,
		frontRight: INVALID,
		rearLeft: INVALID,
		rearRight: INVALID
	};

	// for lapIsIncreasing()
	previousLap = {
		frontLeft: INVALID,
		frontRight: INVALID,
		rearLeft: INVALID,
		rearRight: INVALID
	};

	@observable
	brakeTemp: ITireData<IBrakeTemp> = {
		FrontLeft: {
			CurrentTemp: INVALID,
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		},
		FrontRight: {
			CurrentTemp: INVALID,
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		},
		RearLeft: {
			CurrentTemp: INVALID,
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		},
		RearRight: {
			CurrentTemp: INVALID,
			OptimalTemp: INVALID,
			ColdTemp: INVALID,
			HotTemp: INVALID
		}
	};

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);
	}

	componentWillUnmount() {
		unregisterUpdate(this.update);
	}

	@action
	private update = () => {
		this.brakeTemp = r3e.data.BrakeTemp;
		this.tireWear = r3e.data.TireWear;
		this.tireDirt = r3e.data.TireDirt;
		this.tireTemp = r3e.data.TireTemp;
		this.tirePressure = r3e.data.TirePressure;
	};

	/**
	// function to get the tire wear at lap start
	private lapStartTireWear(
		lapsAgo: number,
		tireWearValue: number,
		tireId: string
		) {
		if (this.lapIsIncreasing()) {
			// tire wear from 1 lap ago gets "passed down"
			this.wear1LapsAgo[tireId] = this.wear0LapsAgo[tireId];
			// tire wear from start of this lap gets updated
			this.wear0LapsAgo[tireId] = tireWearValue;
		}
		// returns the tire wear value for the start of current lap
		if (lapsAgo === 0) {
			return this.wear0LapsAgo[tireId];
		}
		// returns the tire wear value from start of 1 lap ago
		return this.wear1LapsAgo[tireId];
	}
	*/

	private lapStartTireWearFrontLeft(lapsAgo: number) {
		if (this.lapIsIncreasingFrontLeft()) {
			this.wear1LapsAgo.frontLeft = this.wear0LapsAgo.frontLeft;
			this.wear0LapsAgo.frontLeft = r3e.data.TireWear.FrontLeft; }
		if (lapsAgo === 0) {return this.wear0LapsAgo.frontLeft; }
		return this.wear1LapsAgo.frontLeft;
	}
	private lapStartTireWearFrontRight(lapsAgo: number) {
		if (this.lapIsIncreasingFrontRight()) {
			this.wear1LapsAgo.frontRight = this.wear0LapsAgo.frontRight;
			this.wear0LapsAgo.frontRight = r3e.data.TireWear.FrontRight; }
		if (lapsAgo === 0) {return this.wear0LapsAgo.frontRight; }
		return this.wear1LapsAgo.frontRight;
	}
	private lapStartTireWearRearLeft(lapsAgo: number) {
		if (this.lapIsIncreasingRearLeft()) {
			this.wear1LapsAgo.rearLeft = this.wear0LapsAgo.rearLeft;
			this.wear0LapsAgo.rearLeft = r3e.data.TireWear.RearLeft; }
		if (lapsAgo === 0) {return this.wear0LapsAgo.rearLeft; }
		return this.wear1LapsAgo.rearLeft;
	}
	private lapStartTireWearRearRight(lapsAgo: number) {
		if (this.lapIsIncreasingRearRight()) {
			this.wear1LapsAgo.rearRight = this.wear0LapsAgo.rearRight;
			this.wear0LapsAgo.rearRight = r3e.data.TireWear.RearRight; }
		if (lapsAgo === 0) {return this.wear0LapsAgo.rearRight; }
		return this.wear1LapsAgo.rearRight;
	}
	// this works if used with one input only
	private lapIsIncreasingFrontLeft() {
		const now = r3e.data.CompletedLaps;
		if (now > this.previousLap.frontLeft) {
			this.previousLap.frontLeft = now;
			return true;
		}
		this.previousLap.frontLeft = now;
		return false;
	}
	private lapIsIncreasingFrontRight() {
		const now = r3e.data.CompletedLaps;
		if (now > this.previousLap.frontRight) {
			this.previousLap.frontRight = now;
			return true;
		}
		this.previousLap.frontRight = now;
		return false;
	}
	private lapIsIncreasingRearLeft() {
		const now = r3e.data.CompletedLaps;
		if (now > this.previousLap.rearLeft) {
			this.previousLap.rearLeft = now;
			return true;
		}
		this.previousLap.rearLeft = now;
		return false;
	}
	private lapIsIncreasingRearRight() {
		const now = r3e.data.CompletedLaps;
		if (now > this.previousLap.rearRight) {
			this.previousLap.rearRight = now;
			return true;
		}
		this.previousLap.rearRight = now;
		return false;
	}
	private getBrakeColor(temp: IBrakeTemp) {
		const currentTemp = temp.CurrentTemp;
		const red = '#990000';
		const green = '#009900';
		const blue = '#000099';

		let fromColor = green;
		let toColor = green;
		let amount = 0;

		// Magic numbers decided based on some random sample cars

		if (currentTemp < temp.ColdTemp) {
			return blue;
		}
		if (currentTemp > temp.HotTemp) {
			return red;
		}
		if (currentTemp > temp.OptimalTemp) {
			const localDelta = temp.HotTemp - temp.OptimalTemp;
			const deltaFromCold = currentTemp - temp.OptimalTemp;
			amount = Math.min(1, deltaFromCold / localDelta);
			fromColor = green;
			toColor = red;
		} else {
			const localDelta = temp.OptimalTemp - temp.ColdTemp;
			const deltaFromCold = currentTemp - temp.ColdTemp;
			amount = Math.min(1, deltaFromCold / localDelta);

			fromColor = blue;
			toColor = green;
		}

		return lerpColor(fromColor, toColor, amount);
	}

	private getTireTempColorLeft(temp: ITireTemp) {
		const currentTemp = temp.CurrentTemp.Left;
		const red = '#990000';
		const green = '#009900';
		const blue = '#000099';

		let fromColor = green;
		let toColor = green;
		let amount = 0;

		if (currentTemp < temp.ColdTemp) {
			return blue;
		}
		if (currentTemp > temp.HotTemp) {
			return red;
		}
		if (currentTemp > temp.OptimalTemp) {
			const localDelta = temp.HotTemp - temp.OptimalTemp;
			const deltaFromCold = currentTemp - temp.OptimalTemp;
			amount = Math.min(1, deltaFromCold / localDelta);
			fromColor = green;
			toColor = red;
		} else {
			const localDelta = temp.OptimalTemp - temp.ColdTemp;
			const deltaFromCold = currentTemp - temp.ColdTemp;
			amount = Math.min(1, deltaFromCold / localDelta);

			fromColor = blue;
			toColor = green;
		}

		return lerpColor(fromColor, toColor, amount);
	}
	private getTireTempColorCenter(temp: ITireTemp) {
		const currentTemp = temp.CurrentTemp.Center;
		const red = '#990000';
		const green = '#009900';
		const blue = '#000099';

		let fromColor = green;
		let toColor = green;
		let amount = 0;

		if (currentTemp < temp.ColdTemp) {
			return blue;
		}
		if (currentTemp > temp.HotTemp) {
			return red;
		}
		if (currentTemp > temp.OptimalTemp) {
			const localDelta = temp.HotTemp - temp.OptimalTemp;
			const deltaFromCold = currentTemp - temp.OptimalTemp;
			amount = Math.min(1, deltaFromCold / localDelta);
			fromColor = green;
			toColor = red;
		} else {
			const localDelta = temp.OptimalTemp - temp.ColdTemp;
			const deltaFromCold = currentTemp - temp.ColdTemp;
			amount = Math.min(1, deltaFromCold / localDelta);

			fromColor = blue;
			toColor = green;
		}

		return lerpColor(fromColor, toColor, amount);
	}
	private getTireTempColorRight(temp: ITireTemp) {
		const currentTemp = temp.CurrentTemp.Right;
		const red = '#990000';
		const green = '#009900';
		const blue = '#000099';

		let fromColor = green;
		let toColor = green;
		let amount = 0;

		if (currentTemp < temp.ColdTemp) {
			return blue;
		}
		if (currentTemp > temp.HotTemp) {
			return red;
		}
		if (currentTemp > temp.OptimalTemp) {
			const localDelta = temp.HotTemp - temp.OptimalTemp;
			const deltaFromCold = currentTemp - temp.OptimalTemp;
			amount = Math.min(1, deltaFromCold / localDelta);
			fromColor = green;
			toColor = red;
		} else {
			const localDelta = temp.OptimalTemp - temp.ColdTemp;
			const deltaFromCold = currentTemp - temp.ColdTemp;
			amount = Math.min(1, deltaFromCold / localDelta);

			fromColor = blue;
			toColor = green;
		}

		return lerpColor(fromColor, toColor, amount);
	}

	render() {
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames(style.tires, this.props.className)}
			>
				{['FrontLeft', 'FrontRight', 'RearLeft', 'RearRight'].map(
					// tireaddress returns 'FrontLeft'... for each wheel
					(tireAddress) => {
						// wheelclass returns 'frontLeft'... for each wheel
						const tireId = tireAddress.replace(/^./, (str) => {
							return str.toLowerCase();
						});
						return (
							<div
								key={tireAddress}
								className={classNames('wheelCenter', tireId)}
							>
								<div className="tempCenter mono">
									{this.tireTemp[tireAddress]
									.CurrentTemp.Left.toFixed(0)}
									°
									{this.tireTemp[tireAddress]
									.CurrentTemp.Center.toFixed(0)}
									°
									{this.tireTemp[tireAddress]
									.CurrentTemp.Right.toFixed(0)}
									°
								</div>
								<div className="tireInfo">
									<p>{(100 - (1 - this.tireWear[tireAddress])
										* 100).toFixed(1)}% </p>

									<p>{this.tirePressure[tireAddress]
									.toFixed(0)}{('kPa')} </p>

								</div>
								<div
									className={classNames('brake', tireId)}
									style={{
										background: this.getBrakeColor(
											this.brakeTemp[tireAddress]
										)
									}}
								/>
								<div className="tireWearContainerLeft">
									<div
										className={classNames(
											'tireWearLeft',
											tireId
										)}
										style={{
											height: `${this.tireWear[tireAddress] *
												100}%`,
											background: this.getTireTempColorLeft(
												this.tireTemp[tireAddress]
											)
										}}
									/>
								</div>
								<div className="tireWearContainerCenter">
									<div
										className={classNames(
											'tireWearCenter',
											tireId
										)}
										style={{
											height: `${this.tireWear[tireAddress] *
												100}%`,
											background: this.getTireTempColorCenter(
												this.tireTemp[tireAddress]
											)
										}}
									/>
								</div>
								<div className="tireWearContainerRight">
									<div
										className={classNames(
											'tireWearRight',
											tireId
										)}
										style={{
											height: `${this.tireWear[tireAddress] *
												100}%`,
											background: this.getTireTempColorRight(
												this.tireTemp[tireAddress]
											)
										}}
									/>
								</div>
								<div
									className="tireDirtOverlay"
									style={{
										opacity: this.tireDirt[tireAddress]
									}}
								/>
								<div className="lastLapFrontLeft">
									{ tireId === 'frontLeft' ?
									this.lapStartTireWearFrontLeft(1) -
									this.lapStartTireWearFrontLeft(0) > 0 ?
									((this.lapStartTireWearFrontLeft(1) -
									this.lapStartTireWearFrontLeft(0)) * 100).toFixed(2)
									: '--' : null
									}
									{ tireId === 'frontLeft' ?
									('%') : null
									}
								</div>
								<div className="lastLapFrontRight">
									{ tireId === 'frontRight' ?
									this.lapStartTireWearFrontRight(1) -
									this.lapStartTireWearFrontRight(0) > 0 ?
									((this.lapStartTireWearFrontRight(1) -
									this.lapStartTireWearFrontRight(0)) * 100).toFixed(2)
									: '--' : null
									}
									{ tireId === 'frontRight' ?
									('%') : null
									}
								</div>
								<div className="lastLapRearLeft">
									{ tireId === 'rearLeft' ?
									this.lapStartTireWearRearLeft(1) -
									this.lapStartTireWearRearLeft(0) > 0 ?
									((this.lapStartTireWearRearLeft(1) -
									this.lapStartTireWearRearLeft(0)) * 100).toFixed(2)
									: '--' : null
									}
									{ tireId === 'rearLeft' ?
									('%') : null
									}
								</div>
								<div className="lastLapRearRight">
									{ tireId === 'rearRight' ?
									this.lapStartTireWearRearRight(1) -
									this.lapStartTireWearRearRight(0) > 0 ?
									((this.lapStartTireWearRearRight(1) -
									this.lapStartTireWearRearRight(0)) * 100).toFixed(2)
									: '--' : null
									}
									{ tireId === 'rearRight' ?
									('%') : null
									}
								</div>
							</div>
						);
					}
				)
				}
			</div>
		);
	}
}
