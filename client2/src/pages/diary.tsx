import { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { 
  Box, 
  Heading, 
  Text,  
  FormLabel, 
  Slider, 
  Textarea,
  Button, 
  Container,
  HStack,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Center,
} from '@chakra-ui/react';
import Nav from '../components/NavBar';



export default function Diary() {
   const [satisfaction, setSatisfaction] = useState(0)
   const [difficulty, setDifficulty] = useState(0)
   const [helpfulness, setHelpfulness] = useState(0)
   const [motivation, setMotivation] = useState(0)
   const [quality, setQuality] = useState(0)
   const [comments, setComments] = useState('')
   const [, setSubmitted] = useState(false);

   
   const navigate = useNavigate();

  const handleSatisfactionChange = (value: number) => {
    setSatisfaction(value)
  }

  const handleDifficultyChange = (value: number) => {
    setDifficulty(value)
  }

  const handleHelpfulnessChange = (value: number) => {
    setHelpfulness(value)
  }

  const handleMotivationChange = (value: number) => {
    setMotivation(value)
  }

  const handleQualityChange = (value: number) => {
    setQuality(value)
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setSubmitted(true)
    // Reset the form state here
    setSatisfaction(0)
    setDifficulty(0)
    setHelpfulness(0)
    setMotivation(0)
    setQuality(0)
    setComments('')
    navigate ('/thankyou')
  }

  const getEmoji = (value: number) => {
    switch(value) {
      case 1:
        return '😞'
      case 2:
        return '🙁'
      case 3:
        return '😐'
      case 4:
        return '🙂'
      case 5:
        return '😃'
      default:
        return '🤔'
    }
  }

  return (
   <Box>
      
         <title>NeuroNote Diary</title>
         <meta name="description" content="Feedback page for NeuroNote" />
         <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      <Nav />
      <Container maxW="container.lg" mt={12}>
         <center>
         <Heading fontSize="50px" as="h1" mb={20}>NeuroNote Diary</Heading>
         </center>
            <Text  fontSize="30px" fontWeight="bold" mb={16}>Please slide the emojis below to indicate your level of satisfaction with NeuroNote.</Text>
            <Box as="form" onSubmit={handleSubmit}>
            <Box mb={4}>
               <FormLabel fontSize="25px" htmlFor="satisfaction">How satisfied are you with your music creation experience using NeuroNote today?</FormLabel>
               <HStack spacing={2}>
                  <FormLabel fontSize="55px" fontWeight="bold">{getEmoji(satisfaction)}</FormLabel>
                  <Slider w="40%"  min={1} max={5} value={satisfaction} onChange={handleSatisfactionChange}>
                     <SliderTrack>
                        <SliderFilledTrack bg="purple.500" />
                     </SliderTrack>
                     <SliderThumb boxSize={10}>
                        {getEmoji(satisfaction)}
                     </SliderThumb>
                  </Slider>
               </HStack>
            </Box>
            <Box mb={4}>
               <FormLabel fontSize="25px" htmlFor="difficulty">How difficult was it for you to control your brainwaves today while using NeuroNote?</FormLabel>
               <HStack spacing={2}>
                  <FormLabel fontSize="55px" fontWeight="bold">{getEmoji(difficulty)}</FormLabel>
                  <Slider w="40%"  min={1} max={5} value={difficulty} onChange={handleDifficultyChange}>
                     <SliderTrack>
                        <SliderFilledTrack bg="purple.500" />
                     </SliderTrack>
                     <SliderThumb boxSize={10}>
                        {getEmoji(difficulty)}
                     </SliderThumb>
                  </Slider>
               </HStack>
            </Box>
            <Box mb={4}>
               <FormLabel fontSize="25px" htmlFor="helpfulness">How helpful was the feedback and guidance provided by NeuroNote in helping you create music today?</FormLabel>
               <HStack spacing={2}>
                  <FormLabel fontSize="55px" fontWeight="bold">{getEmoji(helpfulness)}</FormLabel>
                  <Slider w="40%"  min={1} max={5} value={helpfulness} onChange={handleHelpfulnessChange}>
                     <SliderTrack>
                        <SliderFilledTrack bg="purple.500" />
                     </SliderTrack>
                     <SliderThumb boxSize={10}>
                        {getEmoji(helpfulness)}
                     </SliderThumb>
                  </Slider>
               </HStack>
            </Box>
            <Box mb={4}>
               <FormLabel fontSize="25px" htmlFor="motivation">How motivated were you to create music today using NeuroNote?</FormLabel>
               <HStack spacing={2}>
                  <FormLabel fontSize="55px" fontWeight="bold">{getEmoji(motivation)}</FormLabel>
                  <Slider w="40%"  min={1} max={5} value={motivation} onChange={handleMotivationChange}>
                     <SliderTrack>
                        <SliderFilledTrack bg="purple.500" />
                     </SliderTrack>
                     <SliderThumb boxSize={10}>
                        {getEmoji(motivation)}
                     </SliderThumb>
                  </Slider>
               </HStack>
            </Box>
            <Box mb={4}>
               <FormLabel fontSize="25px" htmlFor="quality">How would you rate the quality of the music you created today using NeuroNote?</FormLabel>
               <HStack spacing={2}>
                  <FormLabel fontSize="55px" fontWeight="bold">{getEmoji(quality)}</FormLabel>
                  <Slider w="40%"  min={1} max={5} value={quality} onChange={handleQualityChange} >
                     <SliderTrack>
                        <SliderFilledTrack bg="purple.500" />
                     </SliderTrack>
                     <SliderThumb boxSize={10}>
                        {getEmoji(quality)}
                     </SliderThumb>
                  </Slider>
               </HStack>
            </Box>
            <Box mb={4}>
               <FormLabel fontSize="25px" htmlFor="comments">Do you have any comments or suggestions for NeuroNote?</FormLabel>
               <Textarea   height="320px" fontSize="25px" name="comments" id="comments" value={comments} onChange={(event) => setComments(event.target.value)} border="2px" />
            </Box>
            <center>
            <Button fontSize="25px" type="submit">Submit</Button>
            </center>
            </Box>
      </Container>
   </Box>
   );
}
