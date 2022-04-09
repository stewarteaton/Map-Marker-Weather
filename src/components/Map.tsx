import React from 'react'
import { createCustomEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";

interface MapProps extends google.maps.MapOptions {
    style: { [key: string]: string };
    setMarkerCoord: React.Dispatch<React.SetStateAction<google.maps.LatLng | undefined>>
    setCenter: React.Dispatch<React.SetStateAction<google.maps.LatLngLiteral>>
    setStatus: React.Dispatch<React.SetStateAction<string>>
  }
  

const Map: React.FC<MapProps> = ({
    children,
    style,
    setMarkerCoord,
    setCenter,
    setStatus,
    ...options
  }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [map, setMap] = React.useState<google.maps.Map>();

    // Set Map & Marker Coords
    React.useEffect(() => {
        // initialize marker to Miami
        const x = new google.maps.LatLng(parseFloat('25.76883672477272'), parseFloat('-80.20526242462772'));
        setMarkerCoord(x)
        getUserLocation() // Set map and marker to user location if possible
    },[])
  
    React.useEffect(() => {
      if (ref.current && !map) {
        setMap(new window.google.maps.Map(ref.current, {}));
      }
    }, [ref, map]);
  
    // because React does not do deep comparisons, a custom hook is used
    // see discussion in https://github.com/googlemaps/js-samples/issues/946
    useDeepCompareEffectForMaps(() => {
      if (map) {
        map.setOptions(options);
      }
    }, [map, options]);
  
    const getUserLocation = () => {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
      } else {
        alert('Locating your position..');
        navigator.geolocation.getCurrentPosition((position) => {
          // setStatus('');
          const userCoord = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setMarkerCoord(userCoord)
        }, () => {
          alert('Unable to retrieve your location');
        });
      }
    }
  
    return (
      <>
        <div ref={ref} style={style} />

        {/* Used for child elements like Marker */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // set the map prop on the child component
            return React.cloneElement(child, { map });
          }
        })}
      </>
    );
  };


export default Map


// Functions //
function useDeepCompareEffectForMaps(
    callback: React.EffectCallback,
    dependencies: any[]
  ) {
    React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
  }

  function useDeepCompareMemoize(value: any) {
    const ref = React.useRef();
  
    if (!deepCompareEqualsForMaps(value, ref.current)) {
      ref.current = value;
    }
  
    return ref.current;
}

  const deepCompareEqualsForMaps = createCustomEqual(
    (deepEqual:any) => (a: any, b: any) => {
      if (
        isLatLngLiteral(a) ||
        a instanceof google.maps.LatLng ||
        isLatLngLiteral(b) ||
        b instanceof google.maps.LatLng
      ) {
        return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
      }
  
      // TODO extend to other types
  
      // use fast-equals for other objects
      return deepEqual(a, b);
    }
  );