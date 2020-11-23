class CuboidThing extends Thing {
    renderOntoCanvas(renderer) {
        let x1 = this.positionX - this.scaleX / 2;
        let x2 = this.positionX + this.scaleX / 2; // TODO: account for rotation in all of these
        let y1 = this.positionY - this.scaleY / 2;
        let y2 = this.positionY + this.scaleY / 2; // TODO: account for rotation in all of these
        let z1 = this.positionZ;
        let z2 = this.positionZ + this.scaleZ;

        let lines = [
            {
                ax: x1, ay: y1, az: z1,
                bx: x1, by: y1, bz: z2
            },
            {
                ax: x1, ay: y2, az: z2,
                bx: x1, by: y2, bz: z1
            },
            {
                ax: x2, ay: y1, az: z2,
                bx: x2, by: y1, bz: z1
            },
            {
                ax: x2, ay: y2, az: z2,
                bx: x2, by: y2, bz: z1
            },
            {
                ax: x1, ay: y2, az: z1,
                bx: x2, by: y2, bz: z1
            },
            {
                ax: x1, ay: y1, az: z1,
                bx: x2, by: y1, bz: z1
            },
            {
                ax: x1, ay: y2, az: z1,
                bx: x1, by: y1, bz: z1
            },
            {
                ax: x2, ay: y2, az: z1,
                bx: x2, by: y1, bz: z1
            },
            {
                ax: x1, ay: y2, az: z2,
                bx: x2, by: y2, bz: z2
            },
            {
                ax: x1, ay: y1, az: z2,
                bx: x2, by: y1, bz: z2
            },
            {
                ax: x1, ay: y2, az: z2,
                bx: x1, by: y1, bz: z2
            },
            {
                ax: x2, ay: y2, az: z2,
                bx: x2, by: y1, bz: z2
            }
        ];

        lines.forEach((line) => {
            renderer.drawLineWithSubdivision(line.ax, line.ay, line.az, line.bx, line.by, line.bz, 'hsla(0, 0%, 0%, 0.5)');         
        })
    };
}