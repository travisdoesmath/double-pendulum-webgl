class FastDoublePendulum {
    
    constructor(opts) {
        // default values
        const defaultOpts = {
            G: 9.8,
            theta1: 0.49*Math.PI,
            theta2: 1.0*Math.PI,
            p1: 0,
            p2: 0,
            RK: 4
        }

        if (!opts) {
            opts = defaultOpts
        }
        ['G','theta1','theta2','p1','p2','RK'].map(k => this[k] = opts[k] !== undefined ? opts[k] : defaultOpts[k])
    }

    // theta1dot(theta1, theta2, p1, p2) {
    //     return (p1 - p2*Math.cos(theta1 - theta2))/((1 + Math.sin(theta1 - theta2)**2));
    // }

    // theta2dot(theta1, theta2, p1, p2) {
    //     return (p2*2 - p1*Math.cos(theta1 - theta2))/((1 + Math.sin(theta1 - theta2)**2));
    // }

    // p1dot(theta1, theta2, p1, p2) {
    //     var A1 = (p1*p2*Math.sin(theta1 - theta2))/((1 + Math.sin(theta1 - theta2)**2)),
    //         A2 = (p1**2 - 2*p1*p2*Math.cos(theta1 - theta2) + 2*p2**2)*Math.sin(2*(theta1 - theta2))/(2*(1 + Math.sin(theta1 - theta2)**2)**2);
    //     return -2*this.G*Math.sin(theta1) - A1 + A2;
    // }

    // p2dot(theta1, theta2, p1, p2) {
    //     var A1 = (p1*p2*Math.sin(theta1 - theta2))/((1 + Math.sin(theta1 - theta2)**2)),
    //         A2 = (p1**2 - 2*p1*p2*Math.cos(theta1 - theta2) + 2*p2**2)*Math.sin(2*(theta1 - theta2))/(2*(1 + Math.sin(theta1 - theta2)**2)**2);
    //     return -this.G*Math.sin(theta2) + A1 - A2;

    // }

    f(theta1, theta2, p1, p2) {
        const c12 = Math.cos(theta1 - theta2);
        const s12 = Math.sin(theta1 - theta2);
        const s12sq = s12**2;
        const A1 = (p1*p2*s12)/((1 + s12sq));
        const A2 = (p1**2 - 2*p1*p2*c12 + 2*p2**2)*Math.sin(2*(theta1 - theta2))/(2*(1 + s12sq)**2);
        return [
            (p1 - p2*c12)/((1 + s12sq)), 
            (p2*2 - p1*c12)/((1 + s12sq)), 
            -2*this.G*Math.sin(theta1) - A1 + A2, 
            -this.G*Math.sin(theta2) + A1 - A2
        ];
    }

    RK4(tau) {
        var Y1 = this.f(this.theta1, this.theta2, this.p1, this.p2).map(d => d*tau);
        var Y2 = this.f(this.theta1 + 0.5*Y1[0], this.theta2 + 0.5*Y1[1], this.p1 + 0.5*Y1[2], this.p2 + 0.5*Y1[3]).map(d => d*tau);
        var Y3 = this.f(this.theta1 + 0.5*Y2[0], this.theta2 + 0.5*Y2[1], this.p1 + 0.5*Y2[2], this.p2 + 0.5*Y2[3]).map(d => d*tau);
        var Y4 = this.f(this.theta1 + Y3[0], this.theta2 + Y3[1], this.p1 + Y3[2], this.p2 + Y3[3]).map(d => d*tau);

        return [
            this.theta1 + Y1[0]/6 + Y2[0]/3 + Y3[0]/3 + Y4[0]/6,
            this.theta2 + Y1[1]/6 + Y2[1]/3 + Y3[1]/3 + Y4[1]/6,
            this.p1 + Y1[2]/6 + Y2[2]/3 + Y3[2]/3 + Y4[2]/6,
            this.p2 + Y1[3]/6 + Y2[3]/3 + Y3[3]/3 + Y4[3]/6,
        ]
    }

    RK2(tau) {
        let Y1 = this.f(this.theta1, this.theta2, this.p1, this.p2).map(d => d*tau);
        let Y2 = this.f(this.theta1 + 0.5*Y1[0], this.theta2 + 0.5*Y1[1], this.p1 + 0.5*Y1[2], this.p2 + 0.5*Y1[3]).map(d => d*tau);

        return [
            this.theta1 + 0.5*Y1[0] + 0.5*Y2[0],
            this.theta2 + 0.5*Y1[1] + 0.5*Y2[1],
            this.p1 + 0.5*Y1[2] + 0.5*Y2[2],
            this.p2 + 0.5*Y1[3] + 0.5*Y2[3]
        ]
    }

    tick(t=1/60) {
        let nextState;
        if (this.RK == 4) {
            nextState = this.RK4(t);
        } else {
            nextState = this.RK2(t);
        }
        this.theta1 = nextState[0];
        this.theta2 = nextState[1];
        this.p1 = nextState[2];
        this.p2 = nextState[3];
        // return this.getCoords();
    }

    getAngles() {
        return {
            'theta1': this.theta1,
            'theta2': this.theta2
        }
    }

    getCoords() {
        const s1 = Math.sin(this.theta1);
        const s2 = Math.sin(this.theta2);
        const c1 = -Math.cos(this.theta1);
        const c2 = -Math.cos(this.theta2);
        return {
            'x1':s1,
    		'y1':c1,
	    	'x2':s1 + s2,
		    'y2':c1+c2
        }
    }
}

// export { DoublePendulum }

class DoublePendulum {
    
    constructor(opts) {
        // default values
        const defaultOpts = {
            l1: 1,
            l2: 1,
            m1: 1,
            m2: 1,
            G: 9.8,
            theta1: 0.49*Math.PI,
            theta2: 1.0*Math.PI,
            p1: 0,
            p2: 0 
        }

        if (!opts) {
            opts = defaultOpts
        }
        ['l1','l2','m1','m2','G','theta1','theta2','p1','p2'].map(k => this[k] = opts[k] !== undefined ? opts[k] : defaultOpts[k])
    }

    theta1dot(theta1, theta2, p1, p2) {
        return (p1*this.l2 - p2*this.l1*Math.cos(theta1 - theta2))/(this.l1**2*this.l2*(this.m1 + this.m2*Math.sin(theta1 - theta2)**2));
    }

    theta2dot(theta1, theta2, p1, p2) {
        return (p2*(this.m1+this.m2)*this.l1 - p1*this.m2*this.l2*Math.cos(theta1 - theta2))/(this.m2*this.l1*this.l2**2*(this.m1 + this.m2*Math.sin(theta1 - theta2)**2));
    }

    p1dot(theta1, theta2, p1, p2) {
        var A1 = (p1*p2*Math.sin(theta1 - theta2))/(this.l1*this.l2*(this.m1 + this.m2*Math.sin(theta1 - theta2)**2)),
            A2 = (p1**2*this.m2*this.l2**2 - 2*p1*p2*this.m2*this.l1*this.l2*Math.cos(theta1 - theta2) + p2**2*(this.m1 + this.m2)*this.l1**2)*Math.sin(2*(theta1 - theta2))/(2*this.l1**2*this.l2**2*(this.m1 + this.m2*Math.sin(theta1 - theta2)**2)**2);
        return -(this.m1 + this.m2)*this.G*this.l1*Math.sin(theta1) - A1 + A2;
    }

    p2dot(theta1, theta2, p1, p2) {
        var A1 = (p1*p2*Math.sin(theta1 - theta2))/(this.l1*this.l2*(this.m1 + this.m2*Math.sin(theta1 - theta2)**2)),
            A2 = (p1**2*this.m2*this.l2**2 - 2*p1*p2*this.m2*this.l1*this.l2*Math.cos(theta1 - theta2) + p2**2*(this.m1 + this.m2)*this.l1**2)*Math.sin(2*(theta1 - theta2))/(2*this.l1**2*this.l2**2*(this.m1 + this.m2*Math.sin(theta1 - theta2)**2)**2);
        return -this.m2*this.G*this.l2*Math.sin(theta2) + A1 - A2;

    }

    f(Z) {
        return [this.theta1dot(Z[0], Z[1], Z[2], Z[3]), this.theta2dot(Z[0], Z[1], Z[2], Z[3]), this.p1dot(Z[0], Z[1], Z[2], Z[3]), this.p2dot(Z[0], Z[1], Z[2], Z[3])];
    }

    RK4(tau) {
        var Y1 = this.f([this.theta1, this.theta2, this.p1, this.p2]).map(d => d*tau);
        var Y2 = this.f([this.theta1 + 0.5*Y1[0], this.theta2 + 0.5*Y1[1], this.p1 + 0.5*Y1[2], this.p2 + 0.5*Y1[3]]).map(d => d*tau);
        var Y3 = this.f([this.theta1 + 0.5*Y2[0], this.theta2 + 0.5*Y2[1], this.p1 + 0.5*Y2[2], this.p2 + 0.5*Y2[3]]).map(d => d*tau);
        var Y4 = this.f([this.theta1 + Y3[0], this.theta2 + Y3[1], this.p1 + Y3[2], this.p2 + Y3[3]]).map(d => d*tau);

        return [
            this.theta1 + Y1[0]/6 + Y2[0]/3 + Y3[0]/3 + Y4[0]/6,
            this.theta2 + Y1[1]/6 + Y2[1]/3 + Y3[1]/3 + Y4[1]/6,
            this.p1 + Y1[2]/6 + Y2[2]/3 + Y3[2]/3 + Y4[2]/6,
            this.p2 + Y1[3]/6 + Y2[3]/3 + Y3[3]/3 + Y4[3]/6,
        ]
    }

    tick(t=1/60) {
        var nextState = this.RK4(t);
        this.theta1 = nextState[0];
        this.theta2 = nextState[1];
        this.p1 = nextState[2];
        this.p2 = nextState[3];
        return this.getCoords();
    }

    getAngles() {
        return {
            'theta1': this.theta1,
            'theta2': this.theta2
        }
    }

    getCoords() {
        return {
            'x1':this.l1*Math.sin(this.theta1),
    		'y1':-this.l1*Math.cos(this.theta1),
	    	'x2':this.l1*Math.sin(this.theta1) + this.l2*Math.sin(this.theta2),
		    'y2':-this.l1*Math.cos(this.theta1) - this.l2*Math.cos(this.theta2)
        }
    }
}

// export { DoublePendulum }