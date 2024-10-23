// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.get(import.meta.env.VITE_URL_PREDICCION_TCH, (req, res, ctx) => {
    // Devuelve una respuesta mock del API
    const mockData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            id: '123',
            TCHPRED_6Meses: '50',
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [-90.785, 14.305],
                [-90.780, 14.310],
                [-90.775, 14.305],
                [-90.785, 14.305],
              ],
            ],
          },
        },
      ],
    };
    return res(ctx.status(200), ctx.json(mockData));
  }),
];
