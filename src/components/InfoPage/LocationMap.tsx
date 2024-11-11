import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem'
};

const center = {
  lat: 58.96099,
  lng: -2.97120
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true
};

export const LocationMap: React.FC = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyDjnFVYDNqztyBDLKImtGg0Nct9DFtnX88',
    id: 'google-map-script'
  });

  if (loadError) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Find Us</h2>
            <p className="text-lg text-gray-600 mb-4">
              You will find us at the <strong>Sea Cadets' carpark, Scapa overlooking the beautiful Scapa Beach</strong>, 
              within walking distance or a few minutes drive from Kirkwall town. We are on the St Magnus Way pilgrimage 
              route and a popular beach for sea swimmers, families and dog walkers.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li><strong>We are open: Thursdays, Fridays, Saturdays and Sundays 10:30 am till 3:30pm</strong></li>
            </ul>
          </div>
          <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Map loading failed. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Find Us</h2>
            <p className="text-lg text-gray-600 mb-4">
              You will find us at the <strong>Sea Cadets' carpark, Scapa overlooking the beautiful Scapa Beach</strong>, 
              within walking distance or a few minutes drive from Kirkwall town. We are on the St Magnus Way pilgrimage 
              route and a popular beach for sea swimmers, families and dog walkers.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li><strong>We are open: Thursdays, Fridays, Saturdays and Sundays 10:30 am till 3:30pm</strong></li>
            </ul>
          </div>
          <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Find Us</h2>
          <p className="text-lg text-gray-600 mb-4">
            You will find us at the <strong>Sea Cadets' carpark, Scapa overlooking the beautiful Scapa Beach</strong>, 
            within walking distance or a few minutes drive from Kirkwall town. We are on the St Magnus Way pilgrimage 
            route and a popular beach for sea swimmers, families and dog walkers.
          </p>
          <ul className="space-y-2 text-gray-600">
            <li><strong>We are open: Thursdays, Fridays, Saturdays and Sundays 10:30 am till 3:30pm</strong></li>
          </ul>
        </div>
        <div className="h-[300px] relative">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15}
            options={options}
          >
            <Marker 
              position={center}
              title="Some Good Cuppa"
            />
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};