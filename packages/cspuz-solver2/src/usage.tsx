import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Puzzles from "./puzzles.json";

const puzzleList = (language: "ja" | "en", mode: "solve" | "enumerate") => {
  const sep = language === "ja" ? "、" : ", ";

  const puzzles = Puzzles[mode].map((puzzle) => puzzle[language]);
  if (mode === "enumerate") {
    if (language === "ja") {
      puzzles.push("ナンバーリンク");
    } else if (language === "en") {
      puzzles.push("Numberlink");
    }
  }
  return puzzles.join(sep);
};

export const Usage = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language as "ja" | "en";

  const currentUrl =
    location.protocol + "//" + location.host + location.pathname;
  const bookmarkUrl =
    "javascript:void(window.open(`" +
    currentUrl +
    '#url=${encodeURIComponent(ui.puzzle.getURL(pzpr.parser.URL_PZPRV3))}`,target="__solver_window"))';

  const puzzleWebappVersion = document
    .querySelector('meta[name="revision-cspuz-solver2"]')
    ?.getAttribute("content");
  const cspuzCoreVersion = document
    .querySelector('meta[name="revision-cspuz-core"]')
    ?.getAttribute("content");
  const numlinVersion = document
    .querySelector('meta[name="revision-numlin"]')
    ?.getAttribute("content");
  const buildDate = document
    .querySelector('meta[name="build-date"]')
    ?.getAttribute("content");

  return (
    <Box sx={{ overflowY: "scroll", maxHeight: "600px" }}>
      <Typography variant="h5">{t("usage.overview")}</Typography>
      <Typography>
        <p>{t("usage.overviewText")}</p>
      </Typography>
      <Typography variant="h5">{t("usage.usage")}</Typography>
      <Typography>
        <p>{t("usage.usageText1")}</p>
        <p>{t("usage.usageText2")}</p>
        <p>{t("usage.usageText3")}</p>
        <p>{t("usage.usageText4")}</p>
      </Typography>
      <Typography variant="h5">{t("usage.puzzleLinkIntegration")}</Typography>
      <Typography>
        <p>{t("usage.puzzleLinkIntegrationText")}</p>
        <p></p>

        <p>
          <a href={bookmarkUrl}>{t("usage.bookmarkUrl")}</a>
        </p>
      </Typography>
      <Typography variant="h5">{t("usage.supportedPuzzles")}</Typography>
      <Typography>
        <p>
          {t("usage.solve")}: {puzzleList(language, "solve")}
        </p>
        <p>
          {t("usage.listAnswers")}: {puzzleList(language, "enumerate")}
        </p>
      </Typography>
      <Typography variant="h5">{t("usage.penpaEditorInst")}</Typography>
      <Typography>
        <ul>
          {Object.keys(
            i18n.getResourceBundle(language, "translation").penpaEditorInst ||
              {},
          ).map((key) => (
            <li key={key}>
              <strong>{key}:</strong> {t(`penpaEditorInst.${key}`)}
            </li>
          ))}
        </ul>
      </Typography>
      <Typography variant="h5">{t("usage.disclaimer")}</Typography>
      <Typography>
        <p>{t("usage.disclaimerText")}</p>
      </Typography>
      <Typography variant="h5">{t("usage.versionInfo")}</Typography>
      <Typography>
        {puzzleWebappVersion && (
          <>
            <a href="https://github.com/semiexp/puzzle-webapp">puzzle-webapp</a>
            : {puzzleWebappVersion} <br />
          </>
        )}
        {cspuzCoreVersion && (
          <>
            <a href="https://github.com/semiexp/cspuz_core">cspuz-core</a>:{" "}
            {cspuzCoreVersion} <br />
          </>
        )}
        {numlinVersion && (
          <>
            <a href="https://github.com/semiexp/numlin">numlin</a>:{" "}
            {numlinVersion} <br />
          </>
        )}
        {buildDate && (
          <>
            {t("usage.buildDate")}: {buildDate} <br />
          </>
        )}
      </Typography>
      <Typography>
        <p>
          <a href="license.txt">{t("usage.license")}</a>
        </p>
      </Typography>
      <Typography variant="h5">{t("usage.contact")}</Typography>
      <Typography>
        <p>{t("usage.contactText")}</p>
        <ul>
          <li>
            <a href="https://github.com/semiexp/puzzle-webapp/issues">GitHub</a>
          </li>
          <li>
            <a href="https://twitter.com/semiexp">Twitter (@semiexp)</a>
          </li>
        </ul>
      </Typography>
    </Box>
  );
};
