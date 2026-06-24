import { useEffect, useState } from "react";
import { PageContainer } from "../../components/ui/page-content";
import { Heading } from "../../components/ui/heading";
import { useLanguage } from "../../i18n/LanguageContext";
import { getCountryNames } from "../../api/countrydle/countries.api";
import { sendCountryGuess } from "../../api/countrydle/dailycountrygame.api";
import type { CountryGuessResponse, CountryName } from "../../api/type.api";
import { GameForm } from "../../components/Game/GameForm";
import { HistoryGrid } from "../../components/Game/HistoryGrid";
import { VictoryCard } from "../../components/Game/VictoryCard";

function CountrydlePage() {
	const { t } = useLanguage();
	const [inputValue, setInputValue] = useState('');
	const [countryNames, setCountryNames] = useState<CountryName[]>([]);
	const [suggestions, setSuggestions] = useState<CountryName[]>([]);
	const [guesses, setGuesses] = useState<CountryGuessResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [hasWon, setHasWon] = useState(false);
	const [showVictory, setShowVictory] = useState(false);

	useEffect(() => {
		async function loadCountries() {
			try {
				setIsLoading(true);
				const names = await getCountryNames();
				setCountryNames(names);
				setError(null);
			} catch {
				setError(t("countrydle.loadError"));
			} finally {
				setIsLoading(false);
			}
		}

		loadCountries();
	}, [t]);

	const handleSelectCountry = (countryName: string) => {
		setInputValue(countryName);
		setSuggestions([]);
	};

	const handleInputChange = (text: string) => {
		setInputValue(text);

		if (text.trim() === '') {
			setSuggestions([]);
			return;
		}

		const alreadyGuessedNames = guesses.map((guess) => guess.name.toLowerCase());
		const filtered = countryNames.filter((country) => {
			const matchesText = country.name.toLowerCase().startsWith(text.toLowerCase());
			const isNotAlreadyGuessed = !alreadyGuessedNames.includes(country.name.toLowerCase());
			return matchesText && isNotAlreadyGuessed;
		});

		setSuggestions(filtered);
	};

	const handleSubmitGuess = async (event: React.FormEvent) => {
		event.preventDefault();

		const validCountry = countryNames.find(
			(country) => country.name.toLowerCase() === inputValue.trim().toLowerCase()
		);

		if (!validCountry) {
			alert(t("countrydle.invalidCountry"));
			return;
		}

		if (guesses.some((guess) => guess.name.toLowerCase() === validCountry.name.toLowerCase())) {
			return;
		}

		try {
			const result = await sendCountryGuess(validCountry.name);
			setGuesses([result, ...guesses]);
			setInputValue('');
			setSuggestions([]);

			if (result.isWin) {
				setHasWon(true);
				setTimeout(() => setShowVictory(true), 3750);
			}
		} catch {
			alert(t("countrydle.tryError"));
		}
	};

	if (isLoading) {
		return <div style={{ textAlign: 'center', padding: '50px' }}>{t("countrydle.loading")}</div>;
	}

	const isInputValid = countryNames.some(
		(country) => country.name.toLowerCase() === inputValue.trim().toLowerCase()
	);

	return (
		<PageContainer className="game-PageContainer">
			<Heading>{t("countrydle.title")}</Heading>
			<h2>{t("countrydle.subtitle")}</h2>

			{error && <div className="error-alert">{error}</div>}

			{showVictory && <VictoryCard guessCount={guesses.length} />}

			<GameForm
				inputValue={inputValue}
				hasWon={hasWon}
				isInputValid={isInputValid}
				placeholder={t("countrydle.placeholder")}
				suggestions={suggestions.map((country) => ({
					name: country.name,
					imagePath: country.flagUrl,
				}))}
				onInputChange={handleInputChange}
				onSelectEntity={handleSelectCountry}
				onSubmit={handleSubmitGuess}
			/>

			<HistoryGrid
				columns={[
					t("countrydle.continent"),
					t("countrydle.region"),
					t("countrydle.language"),
					t("countrydle.population"),
					t("countrydle.currency"),
					t("countrydle.currencyName"),
				]}
				guesses={guesses.map((guess) => ({
					entity: {
						name: guess.name,
						imagePath: guess.flagUrl,
					},
					isWin: guess.isWin,
					attributes: [
						guess.continent,
						guess.region,
						guess.language,
						guess.population,
						guess.currency,
						guess.currencyName,
					],
				}))}
			/>
		</PageContainer>
	);
}

export default CountrydlePage;
