import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import DeckCard from "../cards/DeckCard";
import PDFDropzoneDemo from "./PDFDropzoneDemo";
import { ChartMasteryOverview } from "../charts/ChartMasteryOverview";

const BentoGrid = () => {
  return (
    <div
      className="w-full justify-center flex flex-col items-center gap-5"
      id="features"
    >
      <div className="text-center space-y-1">
        <div className="text-3xl font-bold">Features</div>
        <div className="flex items-center gap-1 text-muted-foreground">
          Simple to understand . Simple to use . We make AI aid your learning ,
          not take over it .
        </div>
      </div>
      <div className="grid grid-cols-12 max-w-[1200px] w-full  gap-2">
        {" "}
        <MainBlock />
        <CommunityBlock />
        <FeedbackBlock />
      </div>
    </div>
  );
};

export default BentoGrid;
const MainBlock = () => {
  return (
    <Card className="col-span-12 md:col-span-8 row-span-2">
      <CardHeader>
        <CardTitle>Organise your work smartly.</CardTitle>
        <CardDescription>
          Folders contain decks which contain cards !
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <DeckCard
          demo
          icon={"Prism"}
          id="123"
          title="Chemistry"
          createdAt={"2025-07-01 18:02:54.061498"}
          color="#FF6F61"
          cardCount={40}
          folderName="A Level Subjects"
        />
        <DeckCard
          demo
          icon={"Atom"}
          id="123"
          title="Physics"
          createdAt={"2025-07-01 18:02:54.061498"}
          color="#00FFD1"
          cardCount={40}
          folderName="A Level Subjects"
        />
        <DeckCard
          demo
          icon={"Chart"}
          id="123"
          title="Statistics"
          createdAt={"2025-07-01 18:02:54.061498"}
          color="#00BFFF"
          cardCount={40}
          folderName="O Level Mathematics"
        />
        <DeckCard
          demo
          icon={"Telescope"}
          id="123"
          title="Astronomy"
          createdAt={"2025-07-01 18:02:54.061498"}
          color="#FF497C"
          cardCount={40}
          folderName="Hobbies"
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="font-bold"></div>
        <div className="text-sm  text-muted-foreground">
          This is to prevent any confusion or misintepretation.
        </div>
      </CardFooter>
    </Card>
  );
};

const CommunityBlock = () => {
  return (
    <Card className="md:col-span-4 col-span-12">
      <CardHeader>
        <CardTitle>PDF AI Generations</CardTitle>
        <CardDescription>
          Generate Flashcards from your assignments
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full flex items-center justify-center w-full">
        <PDFDropzoneDemo />
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="font-bold">Choose how many flashcards to generate.</div>
        <div className="text-sm  text-muted-foreground">
          Up to 100 flashcards can be generated in a matter of seconds
        </div>
      </CardFooter>
    </Card>
  );
};

const FeedbackBlock = () => {
  return (
    <Card className="md:col-span-4 col-span-12">
      <CardHeader>
        <CardTitle>Robust Analytics</CardTitle>
        <CardDescription>
          Monitor your proficiency and improvement
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full flex justify-center items-center w-full ">
        <ChartMasteryOverview
          masteryData={[
            {
              mastery: "Weak",
              count: 18,
            },
            {
              mastery: "Very Weak",
              count: 3,
            },

            {
              mastery: "Okay",
              count: 7,
            },
            {
              mastery: "Good",
              count: 10,
            },
            {
              mastery: "Excellent",
              count: 20,
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};
