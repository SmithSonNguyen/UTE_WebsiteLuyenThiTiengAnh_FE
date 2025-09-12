import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import HomeTab from "@/components/home/HomeTab";
import LearnTab from "@/components/home/LearnTab";
import PracticeTab from "@/components/home/PracticeTab";
import ProfileTab from "@/components/home/ProfileTab";

export default function Home() {
  const [tab, setTab] = useState("Home");
  let TabComponent = null;
  if (tab === "Home") TabComponent = <HomeTab />;
  if (tab === "Learn") TabComponent = <LearnTab />;
  if (tab === "Practice") TabComponent = <PracticeTab />;
  if (tab === "Profile") TabComponent = <ProfileTab />;

  return (
    <MainLayout tab={tab} setTab={setTab}>
      {TabComponent}
    </MainLayout>
  );
}
