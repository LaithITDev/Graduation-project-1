import { useEffect, useState } from "react";
import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";

const chartTicks = [
  { y: 24, label: "31.5" },
  { y: 57, label: "31.0" },
  { y: 90, label: "30.5" },
  { y: 123, label: "30.0" },
  { y: 156, label: "29.5" },
  { y: 189, label: "29.0" },
  { y: 222, label: "28.5" },
];

type HappinessLevelProps = {
  isPlaying: boolean;
  playbackStartedAt: number | null;
  playbackDuration: number;
};

function FrequencyChart({ progress }: { progress: number }) {
  const axisColor = useColorModeValue("#758078", "#767c88");
  const gridColor = useColorModeValue("#dbe1de", "#303541");
  const lineColor = useColorModeValue("#e84e76", "#ff557d");
  const points = Array.from({ length: 25 }, (_, index) => {
    const progressAlongChart = index / 24;
    const x = 78 + progressAlongChart * 492;
    const pulse = Math.sin(index * 1.15 + progress * 9) * progress * 4;
    const y = 123 - progress * 80 * progressAlongChart - pulse;
    return { x, y };
  });
  const linePath = points
    .map(({ x, y }, index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const currentFrequency = (30 + progress * 1.2).toFixed(2);

  return (
    <Box
      className="happiness-chart"
      flex="1 1 0"
      height={{ base: "160px", md: "220px" }}
      minW={0}
      role="img"
      aria-label={`Happiness frequency rising to ${currentFrequency} hertz during playback`}
    >
      <svg viewBox="0 0 600 282" preserveAspectRatio="none" width="100%" height="100%">
        {chartTicks.map(({ y, label }) => (
          <g key={label}>
            <line x1="78" y1={y} x2="570" y2={y} stroke={gridColor} strokeWidth="1" />
            <text x="66" y={y + 4} textAnchor="end" fill={axisColor}>
              {label}
            </text>
          </g>
        ))}
        <line x1="78" y1="24" x2="78" y2="222" stroke={gridColor} />
        <line x1="78" y1="222" x2="570" y2="222" stroke={gridColor} />
        <path
          d={linePath}
          fill="none"
          stroke={lineColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <circle cx={points[0].x} cy={points[0].y} r="5" fill={lineColor} />
        <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="5" fill={lineColor} />
        <text x="78" y="245" textAnchor="middle" fill={axisColor}>0s</text>
        <text x="570" y="245" textAnchor="middle" fill={axisColor}>1s</text>
        <text x="324" y="275" textAnchor="middle" fill={axisColor}>Time (s)</text>
        <text
          x="20"
          y="123"
          textAnchor="middle"
          fill={axisColor}
          transform="rotate(-90 20 123)"
        >
          Frequency (Hz)
        </text>
      </svg>
    </Box>
  );
}

function MoodFace({ progress }: { progress: number }) {
  const faceColor = useColorModeValue("#26303c", "#f0f1f3");
  const mouthStart = 82 - progress * 7;
  const mouthMiddle = 62 + progress * 37;

  return (
    <svg
      aria-label={progress > 0.7 ? "Happy face" : "Sad face"}
      className="happiness-face"
      role="img"
      width="96"
      height="96"
      viewBox="0 0 120 120"
    >
      <circle cx="60" cy="60" r="53" fill="none" stroke={faceColor} strokeWidth="10" />
      <circle cx="43" cy="49" r="8" fill={faceColor} />
      <circle cx="77" cy="49" r="8" fill={faceColor} />
      <path
        d={`M40 ${mouthStart} Q60 ${mouthMiddle} 80 ${mouthStart}`}
        fill="none"
        stroke={faceColor}
        strokeLinecap="round"
        strokeWidth="7"
      />
    </svg>
  );
}

export default function HappinessLevel({
  isPlaying,
  playbackStartedAt,
  playbackDuration,
}: HappinessLevelProps) {
  const [progress, setProgress] = useState(0);
  const textColor = useColorModeValue("gray.800", "gray.100");

  useEffect(() => {
    if (!isPlaying || playbackStartedAt === null || playbackDuration <= 0) {
      setProgress(0);
      return;
    }

    let frameId = 0;
    const updateProgress = () => {
      const nextProgress = Math.min(
        1,
        (Date.now() - playbackStartedAt) / (playbackDuration * 1000)
      );
      setProgress(nextProgress);
      if (nextProgress < 1) {
        frameId = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    return () => window.cancelAnimationFrame(frameId);
  }, [isPlaying, playbackStartedAt, playbackDuration]);

  const mood =
    progress > 0.7
      ? "Happy, calm, focused"
      : progress > 0.35
        ? "Feeling better"
        : "Stressed, angry, down";
  const currentFrequency = (30 + progress * 1.2).toFixed(2);

  return (
    <Flex
      as="section"
      aria-label="Happiness level and emotional state"
      className="happiness-level"
      align="center"
      justify="center"
      direction={{ base: "column", md: "row" }}
      gap={{ base: 4, md: 8 }}
      mx="auto"
      my={{ base: 4, md: 2 }}
      px={{ base: 4, md: 6 }}
      width="100%"
      maxW="940px"
    >
      <FrequencyChart progress={progress} />
      <Flex
        className="happiness-state"
        direction="column"
        align="center"
        flexShrink={0}
        width={{ base: "100%", md: "180px" }}
        color={textColor}
      >
        <Heading as="h2" fontSize={{ base: "2xl", md: "3xl" }} mb={1}>
          State
        </Heading>
        <MoodFace progress={progress} />
        <Text mt={3} textAlign="center" fontSize="sm">
          {mood}
        </Text>
        <Text textAlign="center" fontSize="sm">
          {currentFrequency} Hz
        </Text>
      </Flex>
    </Flex>
  );
}