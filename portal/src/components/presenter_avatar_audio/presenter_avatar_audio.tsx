import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "./presenter_avatar_audio.css";

// https://www.flaticon.com/free-icons/avatar

export const PresenterAvatarAudioWave: React.FC<{ isPlaying: boolean, size?: number }> = ({
  isPlaying,
  size = 12,
}) => {

  return (
    <div className="relative">
      <Avatar className={`w-${size} h-${size}`}>
        <AvatarImage src="/images/presenter_avatar.png" alt="Zy's Avatar" className={`${isPlaying ? 'opacity-100' : 'opacity-50'}`} />
        <AvatarFallback>ZY</AvatarFallback>
      </Avatar>
      <div className={`avatar-audio-wave ${isPlaying ? "playing" : "paused"}`}>
        <div className="wave-group">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="wave"
              style={{ animationDelay: `${i * Math.random() / 2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
