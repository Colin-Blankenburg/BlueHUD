import {
	classNames,
	INVALID,
	widgetSettings
} from '../../lib/utils';
import { action, observable } from 'mobx';
import { ITireData } from '../../types/r3eTypes';
import { IWidgetSetting } from '../app/app';
import { observer } from 'mobx-react';
import r3e, { registerUpdate, unregisterUpdate } from '../../lib/r3e';
import React from 'react';
import style from './rake.scss';
import SvgIcon from '../svgIcon/svgIcon';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
	settings: IWidgetSetting;
}

@observer
export default class Rake extends React.Component<IProps, {}> {
	@observable
	rideHeight: ITireData<number> = {
		FrontLeft: 0,
		FrontRight: 0,
		RearLeft: 0,
		RearRight: 0
	};
	@observable
	rakeAngle = 0;
	@observable
	rankenumber = 0;

	constructor(props: IProps) {
		super(props);

		registerUpdate(this.update);

	}
	componentWillUnmount() {
		unregisterUpdate(this.update);
	}
	@action
	private update = () => {
		this.rideHeight = r3e.data.Player.RideHeight;
		this.rankenumber = ((this.rideHeight.FrontLeft +
			this.rideHeight.FrontRight) /
			(this.rideHeight.RearLeft +
			this.rideHeight.RearRight)) - 1;
		this.rakeAngle = this.rankenumber * 30;
	};

	render() {
		return (
			<div
				{...widgetSettings(this.props)}
				className={classNames(style.rake, this.props.className, {
					shouldShow: this.rideHeight.FrontLeft !== INVALID
				})}
			>
				<div className="frontleft">
					{
					this.rideHeight.FrontLeft.toFixed(3)
					}
				</div>
				<div className="frontright">
					{
					this.rideHeight.FrontRight.toFixed(3)
					}
				</div>
				<div className="rearleft">
					{
					this.rideHeight.RearLeft.toFixed(3)
					}
				</div>
				<div className="rearright">
					{
					this.rideHeight.RearRight.toFixed(3)
					}
				</div>
				<div className="rakenumber">
					{
					this.rankenumber.toFixed(2)
					}
					<SvgIcon
						className="rakesvg"
						src={require('./../../img/icons/carSide.svg')}
						style={{
							transform: `rotate(${this.rakeAngle}deg)`
						}}
					/>
				</div>
			</div>
		);
	}
}
