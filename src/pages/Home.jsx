import "@telefonica/mistica/css/reset.css";
import { Link } from "react-router-dom";
import AppHeader from "../components/header";
import {
  Text4,
  Stack,
  Box,
  ResponsiveLayout,
  ButtonLink,
  Image,
  DataCard,
  skinVars,
  useScreenSize,
  useTheme,
  Hero,
  Tag,
  Slideshow,
  Circle,
  IconAddBoltonFilled,
  IconChatFilled,
  IconMapFilled,
  Text,
  ButtonPrimary,
  DisplayMediaCard,
  ThemeVariant,
} from "@telefonica/mistica";
import React from "react";
import "@telefonica/mistica/css/mistica.css";
import wrappedCover from "../img/wrapper_cover.png";
import Footer from "../components/footer";
import SubGrid from "../components/subGrid";
import TeamMember from "../components/teamMember";

const Home = () => {
  const { isDesktopOrBigger } = useScreenSize();
  const { isDarkMode } = useTheme();

  const projects = [
    {
      title: "Mistica wrapped",
      description:
        "Data summary on what has happened in the year 2022 in Mística.",
      link: "https://tinyurl.com/2fyfjdnw",
      buttonLabel: "Visit",
      image: wrappedCover,
    },
    {
      title: "Tokens table",
      description: "Table with all colors equivalence between brands.",
      link: "/tokens",
      buttonLabel: "Visit",
      image:
        "https://images.unsplash.com/photo-1526758405662-5998b5bee9ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
    },
    {
      title: "Repo Dashboard",
      description:
        "Autogenerated dashboard using GitHub repository information.",
      link: "/dashboard",
      buttonLabel: "Visit",
      image:
        "https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1748&q=80",
    },
  ];

  const resources = [
    {
      title: "Design Documentation",
      icon: <IconAddBoltonFilled color={skinVars.colors.brand} />,
      link: "https://brandfactory.telefonica.com/mistica",
      buttonLabel: "Visit",
    },
    {
      title: "Design Discussions",
      icon: <IconChatFilled color={skinVars.colors.brand} />,
      link: "https://github.com/Telefonica/mistica-design/discussions",
      buttonLabel: "Visit",
    },
    {
      title: "Roadmap",
      icon: <IconMapFilled color={skinVars.colors.brand} />,
      link: "https://github.com/Telefonica/mistica-design/projects/2?query=is%3Aopen+sort%3Aupdated-desc",
      buttonLabel: "Visit",
    },
  ];

  const team = [
    {
      name: "Yayo Ceballos",
      src: "https://avatars.githubusercontent.com/u/6722153?v=4",
      description: "Design Lead",
    },
    {
      name: "Ana Lopez",
      src: "https://avatars.githubusercontent.com/u/88187691?v=4",
      src2: "https://i.giphy.com/media/m9eG1qVjvN56H0MXt8/giphy.webp",
      description: "Designer",
    },
    {
      name: "Hector Sancho",
      src: "https://avatars.githubusercontent.com/u/56122343?v=4",
      src2: "https://i.giphy.com/media/3o85xAYQLOhSrmINHO/giphy.webp",
      description: "Designer",
    },
    {
      name: "Alex Bueno",
      src: "https://avatars.githubusercontent.com/u/44420072?v=4",
      src2: "https://i.giphy.com/media/B0vFTrb0ZGDf2/giphy.webp",
      description: "Designer",
    },
    {
      name: "María Estévez",
      src: "https://avatars.githubusercontent.com/u/110095203?v=4",
      description: "Designer",
    },
  ];

  const contact = [
    {
      title: "Telefónica careers",
      buttonLabel: "Visit",
      link: "https://jobs.telefonica.com/?locale=en_GB",
      image: undefined,
    },
  ];

  return (
    <>
      <AppHeader></AppHeader>
      <Box paddingTop={89}></Box>

      <Slideshow
        inverseBullets={isDarkMode ? true : false}
        withBullets
        items={projects.map((project, index) => (
          <Hero
            headline={
              <ThemeVariant isInverse>
                <Tag type="active">Project</Tag>
              </ThemeVariant>
            }
            background="alternative"
            title={project.title}
            description={project.description}
            media={
              <Image
                height={"100%"}
                src={project.image}
                aspectRatio="4:3"
              ></Image>
            }
            buttonLink={
              <ButtonLink to={project.link} newTab={true}>
                {project.buttonLabel}
              </ButtonLink>
            }
          ></Hero>
        ))}
      ></Slideshow>

      <ResponsiveLayout>
        <Box paddingY={isDesktopOrBigger ? 120 : 24}>
          <Stack space={80}>
            <Box paddingY={isDesktopOrBigger ? 40 : 24}>
              <Stack space={48}>
                <Stack space={4}>
                  <Text size={32}>Our resources</Text>
                  <Text4 color={skinVars.colors.textSecondary}>
                    Description of the section
                  </Text4>
                </Stack>
                <SubGrid columns={isDesktopOrBigger ? resources.length : 1}>
                  {resources.map((resource, index) => (
                    <DataCard
                      key={index}
                      icon={
                        <Circle
                          size={40}
                          backgroundColor={skinVars.colors.brandLow}
                        >
                          {resource.icon}
                        </Circle>
                      }
                      title={resource.title}
                      buttonLink={
                        <ButtonLink href={resource.link}>
                          {resource.buttonLabel}
                        </ButtonLink>
                      }
                    />
                  ))}
                </SubGrid>
              </Stack>
            </Box>

            <Box paddingY={isDesktopOrBigger ? 40 : 24}>
              <Stack space={48}>
                <Stack space={4}>
                  <Text size={32}>Meet the team</Text>
                  <Text4 color={skinVars.colors.textSecondary}>
                    Description of the section
                  </Text4>
                </Stack>
                <SubGrid columns={isDesktopOrBigger ? 2 : 1} gap={48}>
                  {team.map((member, index) => (
                    <TeamMember
                      key={index}
                      name={member.name}
                      description={member.description}
                      src={member.src}
                      src2={member.src2}
                    ></TeamMember>
                  ))}
                </SubGrid>
              </Stack>
            </Box>

            <Box paddingY={isDesktopOrBigger ? 40 : 24}>
              <Stack space={48}>
                <Stack space={4}>
                  <Text size={32}>Careers</Text>
                  <Text4 color={skinVars.colors.textSecondary}>
                    Check our open positions
                  </Text4>
                </Stack>
                <SubGrid columns={isDesktopOrBigger ? 2 : 1}>
                  {contact.map((contact, index) => (
                    <DisplayMediaCard
                      aspectRatio="16:9"
                      backgroundImage={contact.image}
                      title={contact.title}
                      button={
                        <ButtonPrimary to={contact.link}>
                          {contact.buttonLabel}
                        </ButtonPrimary>
                      }
                    ></DisplayMediaCard>
                  ))}
                </SubGrid>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </ResponsiveLayout>

      <Footer></Footer>
    </>
  );
};

export default Home;
