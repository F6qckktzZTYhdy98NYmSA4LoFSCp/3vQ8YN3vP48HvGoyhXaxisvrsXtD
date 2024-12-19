import { Audio } from "react-loader-spinner";

export const AudioWave = ({
  size,
  color,
  visibility,
}: {
  size?: number;
  color?: string;
  visibility?: boolean;
} = {}) => {
  size = size || 40;
  color = color || "#EC008C";

  return (
    <Audio
      height={size}
      width={size}
      color={color}
      ariaLabel="audio wave"
      wrapperStyle={{}}
      wrapperClass=""
      visible={visibility}
    />
  );
};

export const AudioWavePresenter = ({ size, visibility }: { size?: number; visibility?: boolean } = {}) => {
  return <AudioWave size={size} color="#8B0000" visibility={visibility} />;
};

export const AudioWaveUser = ({ size, visibility }: { size?: number; visibility?: boolean } = {}) => {
  return <AudioWave size={size} color="#28A745" visibility={visibility} />;
};
