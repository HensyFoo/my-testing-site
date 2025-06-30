import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher"; // 导入组件

export default function HomePage() {

  //这个用来切换语言
  const [language, setLanguage] = useState("zh");

  const navigate = useNavigate();

  const games = [
    {
      title: "剪刀石头布",
      description: "和朋友对战看看谁更厉害！",
      image: "/gallery/rps.jpg",
      route: "/rps",
    },
    // 可以在这里继续添加更多游戏
    {
      title: "Coming Soon",
      description: "敬请期待更多小游戏...",
      image: "/gallery/comingsoon.jpg",
      route: "#",
    },
  ];

  return (
    <div className="container py-5" style={{
      backgroundImage: "url('/Screenshot (254).png')",
      backgroundSize: "cover",
      minHeight: "100vh"
    }}>
        
        <LanguageSwitcher language={language} setLanguage={setLanguage} />

        <h2 className="text-center text-white mb-5">
            {language === "zh" ? "🎮 欢迎来到 Foo 的小游戏平台" : "🎮 Welcome to Foo's Mini Game Hub"}
        </h2>
      

      <div className="row">
        {games.map((game, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <Card className="shadow">
              <Card.Img variant="top" src={game.image} style={{ height: '200px', objectFit: 'cover' }} />
              <Card.Body>
                <Card.Title>{game.title}</Card.Title>
                <Card.Text>{game.description}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (game.route !== "#") navigate(game.route);
                  }}
                >
                  开始游戏
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
