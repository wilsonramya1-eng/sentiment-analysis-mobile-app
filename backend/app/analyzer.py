import math
import re
from dataclasses import dataclass

LEXICON = {
    "amazing": 3.0, "awesome": 3.0, "best": 3.0, "excellent": 3.0,
    "fantastic": 3.0, "great": 2.5, "happy": 2.0, "helpful": 2.0,
    "love": 3.0, "nice": 1.5, "perfect": 3.0, "recommend": 2.0,
    "simple": 1.5, "smooth": 2.0, "useful": 2.0, "good": 2.0,
    "bad": -2.0, "broken": -3.0, "confusing": -2.0, "disappointed": -2.5,
    "hate": -3.0, "horrible": -3.0, "poor": -2.0, "slow": -1.5,
    "terrible": -3.0, "unhelpful": -2.0, "useless": -2.5, "worst": -3.0,
}
NEGATIONS = {"not", "never", "no", "hardly", "isn't", "wasn't", "don't", "didn't"}
BOOSTERS = {"very": 1.4, "really": 1.3, "extremely": 1.7, "slightly": 0.6}


@dataclass(frozen=True)
class SentimentResult:
    label: str
    confidence: float
    score: float
    contributions: list[dict[str, float | str]]


class SentimentAnalyzer:
    token_pattern = re.compile(r"[a-zA-Z]+(?:'[a-z]+)?")

    def analyze(self, text: str) -> SentimentResult:
        tokens = self.token_pattern.findall(text.lower())
        score = 0.0
        contributions = []
        negate_until = -1
        booster = 1.0

        for index, token in enumerate(tokens):
            if token in NEGATIONS:
                negate_until = index + 3
                continue
            if token in BOOSTERS:
                booster = BOOSTERS[token]
                continue
            value = LEXICON.get(token, 0.0)
            if value:
                if index <= negate_until:
                    value *= -0.8
                value *= booster
                contributions.append({"token": token, "score": round(value, 2)})
                score += value
            booster = 1.0

        normalized = math.tanh(score / max(3.0, math.sqrt(max(len(tokens), 1))))
        if normalized > 0.15:
            label = "positive"
        elif normalized < -0.15:
            label = "negative"
        else:
            label = "neutral"
        confidence = 0.5 if label == "neutral" else 0.5 + abs(normalized) / 2
        contributions.sort(key=lambda item: abs(float(item["score"])), reverse=True)
        return SentimentResult(label, round(confidence, 3), round(normalized, 3), contributions[:5])
