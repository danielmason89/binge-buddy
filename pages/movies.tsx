import { useState } from "react";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import {
  Box,
  Heading,
  Container,
  Text,
  FormControl,
  FormLabel,
  VStack,
  Button,
  Stack,
  Icon,
  Input,
  FormErrorMessage,
  useColorModeValue,
  createIcon,
  Select
} from "@chakra-ui/react";

import { SelectControl } from "formik-chakra-ui";

export default function Movies() {
  const [movie, setMovie] = useState("");

  const initialValues = {
    category: "genre",
    personName: "",
    personPronoun: "she/her",
    petType: "",
    petName: "",
    placeName: "",
    thingName: "",
  }

  async function repeat(prompt) {
    setMovie("")

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    // This stuff is a ReadableStream, so we need to convert it to a string
    const data = response.body;
    if (!data) {
      return
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chuckValue = decoder.decode(value)
      setMovie((prev) => (prev || "") + chuckValue)
    }

  }

  async function handleSubmit(
    category: string,
    personName: string,
    personPronoun: string,
    petType: string,
    petName: string,
    placeName: string,
    thingName: string,
  ) {
    const personPrompt = `Generate a movie suggestion for ${personName}. Their pronouns are ${personPronoun}. In a similar format to, Here's a movie suggestion for ${personName} because...`;
    const petPrompt = `Generate a movie suggestion for ${petName} who is a pet ${petType}. In a similar format to, Here's a movie suggestion for ${petName}, hope you enjoy...`;
    const placePrompt = `Generate a movie suggestion based on the following category and topic name. In the format, Here's a movie suggestion of that genre because...\n
    Category: a place\n Topic: ${placeName}\n`;
    const thingPrompt = `Suggest a movie based on the following thing and it's name. In the format, Here's a movie suggestion because...\n
    Category: a thing\n Topic: ${thingName}\n`;

    if (category == "person") {
      try {
        repeat(personPrompt)
      } catch (error) {
        console.error(error)
      }
    } else if (category == "pet") {
      try {
        repeat(petPrompt)
      } catch (error) {
        console.error(error)
      }
    } else if (category == "place") {
      try {
        repeat(placePrompt)
      } catch (error) {
        console.error(error)
      }
    } else if (category == "thing") {
      try {
        repeat(thingPrompt)
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <main>
      <Container bg={useColorModeValue("gray.50", "gray.700")} color={useColorModeValue("gray.700", "gray.200")} alignItems="center" maxW={"3xl"}>
        <VStack
          as={Box}
          align="center"
          textAlign={"center"}
          spacing={{ base: 4, md: 10 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={700}
            fontSize={{ base: "3xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Get ready to...
            <br />
            <Text as={"span"}>
              <Text as={"span"} color={"purple.400"}>
                Binge
              </Text>{" "}
              more{" "}
              <Text as={"span"} color={"green.400"}>
                movies
              </Text>
            </Text>
          </Heading>
          <VStack
            spacing={4}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <Box p={6} rounded="md" w={80} bg="white" color="black">
              <Formik
                initialValues={initialValues}
                onSubmit={(values, { resetForm }) => {
                  handleSubmit(
                    values["category"],
                    values["personName"],
                    values["personPronoun"],
                    values["petType"],
                    values["petName"],
                    values["placeName"],
                    values["thingName"]
                  )
                  resetForm()
                }}
              >
                {({ handleSubmit, values, errors }) => (
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="flex-start">
                      <FormControl isRequired>
                        <FormLabel htmlFor="category">Select an option</FormLabel>
                        <SelectControl name="category">
                          <option value="person">Person</option>
                          <option value="pet">Pet</option>
                          <option value="place">Place</option>
                          <option value="thing">Thing</option>
                        </SelectControl>
                        <FormErrorMessage>{errors.category}</FormErrorMessage>
                      </FormControl>
                      {values.category == "person" && (
                        <>
                          <FormControl isRequired>
                            <FormLabel htmlFor="personName">What is their name?</FormLabel>
                            <Field as={Input} id="personName" name="personName" type="name" variant="filled" bg="gray.200" />
                            <FormErrorMessage>{errors.personName}</FormErrorMessage>
                          </FormControl>

                          <FormControl isRequired>
                            <FormLabel htmlFor="personPronoun">
                              Pronouns
                            </FormLabel>
                            <SelectControl name="personPronoun">
                              <option value="she/her">she/her</option>
                              <option value="he/his">he/his</option>
                              <option value="they/them">they/them</option>
                            </SelectControl>
                            <FormErrorMessage>
                              {errors.personPronoun}
                            </FormErrorMessage>
                          </FormControl>
                        </>
                      )}
                      {values.category === "pet" && (
                        <>
                          <FormControl isRequired>
                            <FormLabel htmlFor="petType">
                              What type of pet do you have?
                            </FormLabel>
                            <Field
                              as={Input}
                              id="petType"
                              name="petType"
                              type="name"
                              variant="filled"
                              bg="gray.200"
                            />
                            <FormErrorMessage>{errors.petType}</FormErrorMessage>
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel htmlFor="petName">
                              What's your pet's name?
                            </FormLabel>
                            <Field
                              as={Input}
                              id="petName"
                              name="petName"
                              type="name"
                              variant="filled"
                              bg="gray.200"
                            />
                            <FormErrorMessage>{errors.petName}</FormErrorMessage>
                          </FormControl>
                        </>
                      )}
                      {values.category === "place" && (
                        <>
                          <FormControl isRequired>
                            <FormLabel htmlFor="placeName">
                              What's the name of the place?
                            </FormLabel>
                            <Field
                              as={Input}
                              id="placeName"
                              name="placeName"
                              type="name"
                              variant="filled"
                              bg="gray.200"
                            />
                            <FormErrorMessage>
                              {errors.placeName}
                            </FormErrorMessage>
                          </FormControl>
                        </>
                      )}
                      {values.category === "thing" && (
                        <>
                          <FormControl isRequired>
                            <FormLabel htmlFor="thingName">
                              What's the thing?
                            </FormLabel>
                            <Field
                              as={Input}
                              id="thingName"
                              name="thingName"
                              type="name"
                              variant="filled"
                              bg="gray.200"
                            />
                            <FormErrorMessage>
                              {errors.thingName}
                            </FormErrorMessage>
                          </FormControl>
                        </>
                      )}
                      <Button type="submit" colorScheme="purple" width="full">
                        Generate Movie
                      </Button>
                    </VStack>
                  </form>
                )}
              </Formik>
            </Box>
            {movie && (
              <Box bg="white" p={6} rounded="md" w="80">
                <Text fontWeight={700} color={"purple.400"}>
                  {movie}
                </Text>
              </Box>
            )}
          </VStack>
        </VStack>
      </Container>
    </main>
  );
}
