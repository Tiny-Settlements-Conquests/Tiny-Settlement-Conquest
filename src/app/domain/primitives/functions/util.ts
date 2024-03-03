import { Point } from "../classes/Point";

export function getNearestPoint(pointToCheck: Point, points: Point[], threshold = Number.MAX_SAFE_INTEGER) {
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;
    points.forEach((point) => {
        const dist = distance(point, pointToCheck);
        if(dist < minDist && dist < threshold) {
            minDist = dist;
            nearest = point
        }
    })
    return nearest;
}

export function distance(p1: Point, p2: Point) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function average(p1: Point, p2: Point) {
    return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

export function add(p1: Point, p2: Point) {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}

export function subtract(p1: Point, p2: Point) {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

export function scale(p1: Point, scaler: number) {
    return new Point(p1.x * scaler, p1.y * scaler);
}

export function normalize(p: Point) {
    return scale(p, 1 / magnitude(p));
}

export function magnitude(p: Point) {
    return Math.hypot(p.x, p.y);
}

export function translate(point: Point, angle: number, offset: number) {
    return new Point(
        point.x + Math.cos(angle) * offset,
        point.y + Math.sin(angle) * offset
    )
}

export function angle(point: Point) {
    return Math.atan2(point.y, point.x);
}

export function getIntersection(A: Point, B: Point, C: Point, D: Point) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

    const eps = 0.001;
 
    if (Math.abs(bottom) > eps) {
       const t = tTop / bottom;
       const u = uTop / bottom;
       if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
          return {
             x: lerp(A.x, B.x, t),
             y: lerp(A.y, B.y, t),
             offset: t,
          };
       }
    }
 
    return null;
 }
 
 export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
 }

 //interpolation
 export function lerp2D(A: Point,B: Point, t: number) {
    return new Point(lerp(A.x, B.x, t), lerp(A.y, B.y, t));
 }
 
 // if you're following along, this comes in a few minutes ;-)
 export function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ", 100%, 60%)";
 }

 export function dot(p1: Point, p2: Point) {
    return p1.x * p2.x + p1.y * p2.y;
 }

 export function getFake3dPoint(point: Point, viewPoint: Point, height: number) {
    const dir = normalize(subtract(point, viewPoint));
    const dist = distance(point, viewPoint);
    const scaler = Math.atan(dist / 300) / (Math.PI / 2);
    return add(point, scale(dir, height * scaler));
 }
