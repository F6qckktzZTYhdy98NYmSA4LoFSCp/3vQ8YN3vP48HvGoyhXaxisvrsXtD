import { Grid } from "react-loader-spinner";
import { useState, useEffect } from 'react';

export const Loader = ({ size }: { size?: number } = {}) => {
  size = size || 80;

//   return (
//     <BallTriangle
//       height={size}
//       width={size}
//       radius={5}
//       color="#a3dff7"
//       ariaLabel="loading component"
//       wrapperStyle={{}}
//       wrapperClass=""
//       visible={true}
//     />
//   );

  // https://mhnpd.github.io/react-loader-spinner/docs/components/grid
  return (
    <Grid
      visible={true}
      height={size}
      width={size}
      color="#a3dff7"
      ariaLabel="grid-loading"
      radius="12.5"
      wrapperStyle={{}}
      wrapperClass="grid-wrapper"
    />
  );
};

export const LoaderFill = ({ message }: { message?: string } = {}) => {
  const [shouldRender, setShouldRender] = useState(false);
  message = message || "Loading";
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Loader size={200} />
      <br />
      <p className="text-center text-2xl mt-4 text-[#237d9f]">
        {message}
        <span>
          <span className="inline-block animate-pulse delay-100">.</span>
          <span className="inline-block animate-pulse delay-150">.</span>
          <span className="inline-block animate-pulse delay-200">.</span>
        </span>
      </p>
    </div>
  );
};
