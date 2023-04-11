import logo from "./logo.svg";
import { KeyboardShortcuts, MidiNumbers } from "react-piano";
import _ from "lodash";
import "react-piano/dist/styles.css";
import SoundfontProvider from "../utils/SoundfontProvider";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  Heading,
  Select,
  Stack,
} from "@chakra-ui/react";
import Nav from "../components/NavBar";
import DimensionsProvider from "../utils/DimensionsProvider";
import PianoWithRecording from "../utils/PianoWithRecording";
import { Component, useState } from "react";
import { CiPlay1 } from "react-icons/ci";
import { BsStop } from "react-icons/bs";
const audioContext = new window.AudioContext();
const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net";

const noteRange = {
  first: MidiNumbers.fromNote("f2"),
  last: MidiNumbers.fromNote("c5"),
};

type Recording = {
  mode: "RECORDING" | "PLAYING";
  events: Array<{
    midiNumber: number;
    time: number;
    duration: number;
  }>;
  currentTime: number;
  currentEvents: Array<{
    midiNumber: number;
    time: number;
    duration: number;
  }>;
};

type AppState = {
  recording: Recording;
  instrument: string;
};
const firstNote = MidiNumbers.fromNote("c3");
const lastNote = MidiNumbers.fromNote("f5");
const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: firstNote,
  lastNote: lastNote,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
});

export default class Home extends Component<{}, AppState> {
  scheduledEvents: NodeJS.Timeout[];
  constructor(props: {}) {
    super(props);

    this.scheduledEvents = [];

    this.state = {
      recording: {
        mode: "RECORDING",
        events: [
          { midiNumber: 45, time: 0, duration: 0.6 },
          { midiNumber: 47, time: 0.7, duration: 0.3 },
          { midiNumber: 50, time: 1, duration: 0.6 },
          { midiNumber: 52, time: 1.7, duration: 0.3 },
          { midiNumber: 53, time: 2, duration: 0.6 },
          { midiNumber: 50, time: 2.7, duration: 0.3 },
          { midiNumber: 48, time: 3, duration: 0.6 },
          { midiNumber: 50, time: 3.7, duration: 0.3 },
          { midiNumber: 52, time: 4, duration: 0.6 },
          { midiNumber: 50, time: 4.7, duration: 0.3 },
          { midiNumber: 48, time: 5, duration: 0.6 },
          { midiNumber: 45, time: 5.7, duration: 0.3 },
          { midiNumber: 43, time: 6, duration: 0.6 },
          { midiNumber: 45, time: 6.7, duration: 0.3 },
          { midiNumber: 47, time: 7, duration: 0.6 },
          { midiNumber: 45, time: 7.7, duration: 0.3 },
          { midiNumber: 43, time: 8, duration: 0.6 },
          { midiNumber: 40, time: 8.7, duration: 0.3 },
          { midiNumber: 43, time: 9, duration: 0.6 },
          { midiNumber: 45, time: 9.7, duration: 0.3 },
          { midiNumber: 47, time: 10, duration: 0.6 },
          { midiNumber: 45, time: 10.7, duration: 0.3 },
        ],
        currentTime: 0,
        currentEvents: [],
      },
      instrument: "acoustic_grand_piano",
    };
  }
  setRecording = (value: Partial<Recording>): void => {
    this.setState({
      recording: { ...this.state.recording, ...value },
    });
  };

  onClickStop = (): void => {
    this.scheduledEvents.forEach((scheduledEvent) => {
      clearTimeout(scheduledEvent);
    });
    this.setRecording({
      mode: "RECORDING",
      currentEvents: [],
    });
  };

  getRecordingEndTime = (): number => {
    if (this.state.recording.events.length === 0) {
      return 0;
    }
    return Math.max(
      ...this.state.recording.events.map((event) => event.time + event.duration)
    );
  };

  onClickPlay = (): void => {
    this.setRecording({
      mode: "PLAYING",
    });
    const startAndEndTimes = _.uniq(
      _.flatMap(this.state.recording.events, (event) => [
        event.time,
        event.time + event.duration,
      ])
    );
    startAndEndTimes.forEach((time) => {
      this.scheduledEvents.push(
        setTimeout(() => {
          const currentEvents = this.state.recording.events.filter((event) => {
            return event.time <= time && event.time + event.duration > time;
          });
          this.setRecording({
            currentEvents,
          });
        }, time * 1000)
      );
    });
    // Stop at the end
    setTimeout(() => {
      this.onClickStop();
    }, this.getRecordingEndTime() * 1000);
  };
  changeInstrument = (event: string): void => {
    this.setState({
      instrument: event,
    });
  };
  render(): JSX.Element {
    return (
      <Box>
        <Nav />
        <Center>
          <Heading m={4} display="block">
            Jam Session 🎹
          </Heading>
        </Center>
        <Card width="fit-content" ml={4}>
          <CardBody>
            Device connection status:{" "}
            <Badge colorScheme="green">Connected</Badge>
          </CardBody>
        </Card>
        <Box w="100%" h="300px"></Box>
        <Flex direction="row" justifyContent="center">
          <Button
            leftIcon={<CiPlay1 />}
            colorScheme="gray"
            variant="solid"
            m={4}
            onClick={this.onClickPlay}
          >
            Play
          </Button>
          <Button
            rightIcon={<BsStop />}
            colorScheme="gray"
            variant="outline"
            m={4}
            onClick={this.onClickStop}
          >
            Stop
          </Button>
          <Select
            placeholder="Select option"
            m={4}
            width="fit-content"
            onChange={(e) => this.changeInstrument(e.target.value)}
            value={this.state.instrument}
          >
            <option value="accordion">accordion</option>
            <option value="acoustic_bass">acoustic_bass</option>
            <option value="acoustic_grand_piano">acoustic_grand_piano</option>
            <option value="acoustic_guitar_nylon">acoustic_guitar_nylon</option>
            <option value="acoustic_guitar_steel">acoustic_guitar_steel</option>
            <option value="agogo">agogo</option>
            <option value="alto_sax">alto_sax</option>
            <option value="applause">applause</option>
            <option value="bagpipe">bagpipe</option>
            <option value="banjo">banjo</option>
            <option value="baritone_sax">baritone_sax</option>
            <option value="bassoon">bassoon</option>
            <option value="bird_tweet">bird_tweet</option>
            <option value="blown_bottle">blown_bottle</option>
            <option value="brass_section">brass_section</option>
            <option value="breath_noise">breath_noise</option>
            <option value="bright_acoustic_piano">bright_acoustic_piano</option>
            <option value="celesta">celesta</option>
            <option value="cello">cello</option>
            <option value="choir_aahs">choir_aahs</option>
            <option value="church_organ">church_organ</option>
            <option value="clarinet">clarinet</option>
            <option value="clavinet">clavinet</option>
            <option value="contrabass">contrabass</option>
            <option value="distortion_guitar">distortion_guitar</option>
            <option value="drawbar_organ">drawbar_organ</option>
            <option value="dulcimer">dulcimer</option>
            <option value="electric_bass_finger">electric_bass_finger</option>
            <option value="electric_bass_pick">electric_bass_pick</option>
            <option value="electric_grand_piano">electric_grand_piano</option>
            <option value="electric_guitar_clean">electric_guitar_clean</option>
            <option value="electric_guitar_jazz">electric_guitar_jazz</option>
            <option value="electric_guitar_muted">electric_guitar_muted</option>
            <option value="electric_piano_1">electric_piano_1</option>
            <option value="electric_piano_2">electric_piano_2</option>
            <option value="english_horn">english_horn</option>
            <option value="fiddle">fiddle</option>
            <option value="flute">flute</option>
            <option value="french_horn">french_horn</option>
            <option value="fretless_bass">fretless_bass</option>
            <option value="fx_1_rain">fx_1_rain</option>
            <option value="fx_2_soundtrack">fx_2_soundtrack</option>
            <option value="fx_3_crystal">fx_3_crystal</option>
            <option value="fx_4_atmosphere">fx_4_atmosphere</option>
            <option value="fx_5_brightness">fx_5_brightness</option>
            <option value="fx_6_goblins">fx_6_goblins</option>
            <option value="fx_7_echoes">fx_7_echoes</option>
            <option value="fx_8_scifi">fx_8_scifi</option>
            <option value="glockenspiel">glockenspiel</option>
            <option value="guitar_fret_noise">guitar_fret_noise</option>
            <option value="guitar_harmonics">guitar_harmonics</option>
            <option value="gunshot">gunshot</option>
            <option value="harmonica">harmonica</option>
            <option value="harpsichord">harpsichord</option>
            <option value="helicopter">helicopter</option>
            <option value="honkytonk_piano">honkytonk_piano</option>
            <option value="kalimba">kalimba</option>
            <option value="koto">koto</option>
            <option value="lead_1_square">lead_1_square</option>
            <option value="lead_2_sawtooth">lead_2_sawtooth</option>
            <option value="lead_3_calliope">lead_3_calliope</option>
            <option value="lead_4_chiff">lead_4_chiff</option>
            <option value="lead_5_charang">lead_5_charang</option>
            <option value="lead_6_voice">lead_6_voice</option>
            <option value="lead_7_fifths">lead_7_fifths</option>
            <option value="lead_8_bass__lead">lead_8_bass__lead</option>
            <option value="marimba">marimba</option>
            <option value="melodic_tom">melodic_tom</option>
            <option value="music_box">music_box</option>
            <option value="muted_trumpet">muted_trumpet</option>
            <option value="oboe">oboe</option>
            <option value="ocarina">ocarina</option>
            <option value="orchestra_hit">orchestra_hit</option>
            <option value="orchestral_harp">orchestral_harp</option>
            <option value="overdriven_guitar">overdriven_guitar</option>
            <option value="pad_1_new_age">pad_1_new_age</option>
            <option value="pad_2_warm">pad_2_warm</option>
            <option value="pad_3_polysynth">pad_3_polysynth</option>
            <option value="pad_4_choir">pad_4_choir</option>
            <option value="pad_5_bowed">pad_5_bowed</option>
            <option value="pad_6_metallic">pad_6_metallic</option>
            <option value="pad_7_halo">pad_7_halo</option>
            <option value="pad_8_sweep">pad_8_sweep</option>
            <option value="pan_flute">pan_flute</option>
            <option value="percussive_organ">percussive_organ</option>
            <option value="piccolo">piccolo</option>
            <option value="pizzicato_strings">pizzicato_strings</option>
            <option value="recorder">recorder</option>
            <option value="reed_organ">reed_organ</option>
            <option value="reverse_cymbal">reverse_cymbal</option>
            <option value="rock_organ">rock_organ</option>
            <option value="seashore">seashore</option>
            <option value="shakuhachi">shakuhachi</option>
            <option value="shamisen">shamisen</option>
            <option value="shanai">shanai</option>
            <option value="sitar">sitar</option>
            <option value="slap_bass_1">slap_bass_1</option>
            <option value="slap_bass_2">slap_bass_2</option>
            <option value="soprano_sax">soprano_sax</option>
            <option value="steel_drums">steel_drums</option>
            <option value="string_ensemble_1">string_ensemble_1</option>
            <option value="string_ensemble_2">string_ensemble_2</option>
            <option value="synth_bass_1">synth_bass_1</option>
            <option value="synth_bass_2">synth_bass_2</option>
            <option value="synth_brass_1">synth_brass_1</option>
            <option value="synth_brass_2">synth_brass_2</option>
            <option value="synth_choir">synth_choir</option>
            <option value="synth_drum">synth_drum</option>
            <option value="synth_strings_1">synth_strings_1</option>
            <option value="synth_strings_2">synth_strings_2</option>
            <option value="taiko_drum">taiko_drum</option>
            <option value="tango_accordion">tango_accordion</option>
            <option value="telephone_ring">telephone_ring</option>
            <option value="tenor_sax">tenor_sax</option>
            <option value="timpani">timpani</option>
            <option value="tinkle_bell">tinkle_bell</option>
            <option value="tremolo_strings">tremolo_strings</option>
            <option value="trombone">trombone</option>
            <option value="trumpet">trumpet</option>
            <option value="tuba">tuba</option>
            <option value="tubular_bells">tubular_bells</option>
            <option value="vibraphone">vibraphone</option>
            <option value="viola">viola</option>
            <option value="violin">violin</option>
            <option value="voice_oohs">voice_oohs</option>
            <option value="whistle">whistle</option>
            <option value="woodblock">woodblock</option>
            <option value="xylophone">xylophone</option>
          </Select>
        </Flex>
        <DimensionsProvider>
          {({ containerWidth, containerHeight }) => (
            <SoundfontProvider
              instrumentName={this.state.instrument}
              audioContext={audioContext}
              hostname={soundfontHostname}
              render={({ isLoading, playNote, stopNote }) => (
                <PianoWithRecording
                  recording={this.state.recording}
                  noteRange={noteRange}
                  width={containerWidth}
                  playNote={playNote}
                  stopNote={stopNote}
                  disabled={isLoading}
                  keyboardShortcuts={keyboardShortcuts}
                />
              )}
            />
          )}
        </DimensionsProvider>
      </Box>
    );
  }
}
