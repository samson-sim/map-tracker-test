import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();

const PORT: number = Number(process.env.PORT) || 4000;
const API_KEY: string = process.env.API_KEY || "test-key";

app.use(cors());
app.use(express.json());

export interface TrackedObject {
  id: string;
  x: number;
  y: number;
  direction: number;
}

const INITIAL_OBJECT_COUNT = 60;
const MAX_OBJECT_COUNT = 120;

const objects: Map<string, TrackedObject> = new Map();

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function createRandomObject(id: string | number): TrackedObject {
  return {
    id: String(id),
    x: randomInRange(5, 95),
    y: randomInRange(5, 95),
    direction: Math.floor(randomInRange(0, 360)),
  };
}

for (let i = 1; i <= INITIAL_OBJECT_COUNT; i++) {
  objects.set(String(i), createRandomObject(i));
}

setInterval(() => {
  for (const obj of objects.values()) {
    const speed = 0.8 + Math.random() * 0.7;
    const angleRad = (obj.direction * Math.PI) / 180;

    obj.x += Math.cos(angleRad) * speed;
    obj.y += Math.sin(angleRad) * speed;

    if (obj.x < 0) {
      obj.x = 0;
      obj.direction = 180 - obj.direction;
    }
    if (obj.x > 100) {
      obj.x = 100;
      obj.direction = 180 - obj.direction;
    }
    if (obj.y < 0) {
      obj.y = 0;
      obj.direction = 360 - obj.direction;
    }
    if (obj.y > 100) {
      obj.y = 100;
      obj.direction = 360 - obj.direction;
    }

    obj.direction += randomInRange(-10, 10);
    if (obj.direction < 0) obj.direction += 360;
    if (obj.direction >= 360) obj.direction -= 360;
  }

  if (objects.size > 0 && Math.random() < 0.03) {
    const ids = Array.from(objects.keys());
    const randomId = ids[Math.floor(Math.random() * ids.length)];
    objects.delete(randomId);
  }

  if (objects.size < MAX_OBJECT_COUNT && Math.random() < 0.03) {
    const newId = String(Date.now());
    objects.set(newId, createRandomObject(newId));
  }
}, 1000);

function checkApiKey(req: Request, res: Response, next: NextFunction): void {
  const headerKey = req.headers["x-api-key"];
  const keyFromHeader = Array.isArray(headerKey) ? headerKey[0] : headerKey;

  const key: string | undefined =
    (keyFromHeader as string | undefined) ||
    (req.query.apiKey as string | undefined) ||
    (req.body?.apiKey as string | undefined);

  if (!key || key !== API_KEY) {
    res.status(401).json({ error: "Unauthorized: invalid API key" });
    return;
  }

  next();
}

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get(
  "/objects",
  checkApiKey,
  (
    req: Request,
    res: Response<{ serverTime: number; objects: TrackedObject[] }>
  ) => {
    const allObjects: TrackedObject[] = Array.from(objects.values());

    res.json({
      serverTime: Date.now(),
      objects: allObjects,
    });
  }
);

app.listen(PORT, () => {
  console.log(`Mock server listening on http://localhost:${PORT}`);
  console.log(`API key: ${API_KEY}`);
});
