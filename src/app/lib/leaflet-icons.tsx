'use client';

import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { ReactElement } from 'react';

export function createLucideIconMarker(icon: ReactElement, color = '#FF885B') {
  const html = renderToString(
    <div
      style={{
        position: 'relative',
        width: '44px',
        height: '44px',
        backgroundColor: color,
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
        boxShadow: `0 6px 12px ${color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          backgroundColor: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: 'rotate(45deg)',
          transition: 'all 0.2s ease-in-out',
        }}
        className="inner-circle"
      >
        <div style={{ color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
    </div>
  );

  return L.divIcon({
    html,
    className: 'custom-lucide-marker group hover:scale-110 transition-transform',
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -38],
  });
}
