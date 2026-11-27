export const dataset = {
    casestudies: () => [
      {
        label: 'Toronto',
        options: [
          {
            value: "Downtown Yonge",
            text: "Downtown Yonge"
          },
          {
            value: "North York Centre",
            text: "North York Centre"
          },
          {
            value: "Liberty Village",
            text: "Liberty Village"
          },
          {
            value: "Spadina",
            text: "Spadina"
          },
          {
            value: "Pickering Town Centre",
            text: "Pickering Town Centre"
          },
          {
            value: "Square One",
            text: "Square One"
          },
          {
            value: "Scarborough Town Centre",
            text: "Scarborough Town Centre"
          },
          {
            value: "Vaughan Mills",
            text: "Vaughan Mills"
          },
          {
            value: "Yorkdale",
            text: "Yorkdale"
          },
          {
            value: "Brampton",
            text: "Brampton"
          },
          {
            value: "Etobicoke Lakeshore",
            text: "Etobicoke Lakeshore"
          },
          {
            value: "Golden Mile",
            text: "Golden Mile"
          },
          {
            value: "Markham",
            text: "Markham"
          },
          {
            value: "Oakville",
            text: "Oakville"
          },
          {
            value: "Pickering",
            text: "Pickering"
          },
          {
            value: "Kingston Road",
            text: "Kingston Road"
          },
          {
            value: "Thorncliffe Park",
            text: "Thorncliffe Park"
          },
          {
            value: "Newmarket",
            text: "Newmarket"
          },
          {
            value: "Weston",
            text: "Weston"
          },
          {
            value: "West Queen West",
            text: "West Queen West"
          },
          {
            value: "Mississauga Dundas",
            text: "Mississauga Dundas"
          },
          {
            value: "Caledon East",
            text: "Caledon East"
          },
          {
            value: "Sutton",
            text: "Sutton"
          },
          {
            value: "Schomberg",
            text: "Schomberg"
          },
          {
            value: "Uxbridge",
            text: "Uxbridge"
          }
        ]        
      },
      {
        label: 'Montreal',
        options: [
          {
            value: "Rue Saint Catherine",
            text: "Rue Saint Catherine"
          },
          {
            value: "Rue St Paul",
            text: "Rue St Paul"
          },
          {
            value: "Notre Dame",
            text: "Notre Dame"
          },
          {
            value: "St Denis",
            text: "St Denis"
          },
          {
            value: "Carrefour Laval",
            text: "Carrefour Laval"
          },
          {
            value: "Carrefour Richelieu",
            text: "Carrefour Richelieu"
          },
          {
            value: "Centre Rockland",
            text: "Centre Rockland"
          },
          {
            value: "Fairview Pointe Claire",
            text: "Fairview Pointe Claire"
          },
          {
            value: "Mall Champlain",
            text: "Mall Champlain"
          },
          {
            value: "Rue Wellington",
            text: "Rue Wellington"
          },
          {
            value: "Rue Fleury",
            text: "Rue Fleury"
          },
          {
            value: "Rue Ontario",
            text: "Rue Ontario"
          },
          {
            value: "Mont Royal",
            text: "Mont Royal"
          },
          {
            value: "Boul St. Martin",
            text: "Boul St. Martin"
          },
          {
            value: "Rue St Charles",
            text: "Rue St Charles"
          },
          {
            value: "Rue St George",
            text: "Rue St George"
          },
          {
            value: "Rue St Anne",
            text: "Rue St Anne"
          },
          {
            value: "Rue Richelieu",
            text: "Rue Richelieu"
          },
          {
            value: "St Eustache",
            text: "St Eustache"
          }
        ]        
      },
      {
        label: 'Edmonton',
        options: [
          {
            value: "JasperAve",
            text: "JasperAve"
          },
          {
            value: "104StreetDowntown",
            text: "104StreetDowntown"
          },
          {
            value: "97StreetDowntown",
            text: "97StreetDowntown"
          },
          {
            value: "107AvenueNW",
            text: "107AvenueNW"
          },
          {
            value: "BonnieDoonSC",
            text: "BonnieDoonSC"
          },
          {
            value: "KingswayMall",
            text: "KingswayMall"
          },
          {
            value: "SouthgateCentre",
            text: "SouthgateCentre"
          },
          {
            value: "WestEdmontonMall",
            text: "WestEdmontonMall"
          },
          {
            value: "StAlbertRoad",
            text: "StAlbertRoad"
          },
          {
            value: "124StreetNW",
            text: "124StreetNW"
          },
          {
            value: "82AvenueNW",
            text: "82AvenueNW"
          },
          {
            value: "118AlbertaAve",
            text: "118AlbertaAve"
          },
          {
            value: "118Beverly",
            text: "118Beverly"
          },
          {
            value: "ParsonsRoadSW",
            text: "ParsonsRoadSW"
          },
          {
            value: "StonyPlainRoadNW",
            text: "StonyPlainRoadNW"
          },
          {
            value: "97StreetNorth",
            text: "97StreetNorth"
          },
          {
            value: "104Street",
            text: "104Street"
          },
          {
            value: "137AvenueNW",
            text: "137AvenueNW"
          },
          {
            value: "SherwoodDrive",
            text: "SherwoodDrive"
          },
          {
            value: "149StreetNW",
            text: "149StreetNW"
          },
          {
            value: "50Ave",
            text: "50Ave"
          },
          {
            value: "50StreetStonyPlain",
            text: "50StreetStonyPlain"
          },
          {
            value: "50StreetBeaumont",
            text: "50StreetBeaumont"
          },
          {
            value: "100Ave",
            text: "100Ave"
          }
        ]
        
      }
    ]
  };
// Canadian French display names for Montreal-region streets and malls. Keys are the English names
// used in the select options above, in the report CSV column names and in the `name` column of the
// case study CSVs (several spellings exist). Translate at display time only: the English names stay
// the lookup keys. Names without an entry are shown unchanged.
export const selectLabelsFr = {
  'Rue Saint Catherine': 'Rue Sainte-Catherine',
  'Rue Sainte Catherine': 'Rue Sainte-Catherine',
  'Rue St Paul': 'Rue Saint-Paul',
  'Rue St. Paul': 'Rue Saint-Paul',
  'Notre Dame': 'Rue Notre-Dame',
  'Notre-Dame': 'Rue Notre-Dame',
  'St Denis': 'Rue Saint-Denis',
  'St. Denis': 'Rue Saint-Denis',
  'Fairview Pointe Claire': 'Fairview Pointe-Claire',
  'Mall Champlain': 'Mail Champlain',
  'Mont Royal': 'Avenue du Mont-Royal',
  'Boul St. Martin': 'Boulevard Saint-Martin',
  'Boulevard St. Martin': 'Boulevard Saint-Martin',
  'Rue St Charles': 'Rue Saint-Charles',
  'Rue St. Charles': 'Rue Saint-Charles',
  'Rue St George': 'Rue Saint-Georges',
  'Rue St. George': 'Rue Saint-Georges',
  'Rue St Anne': 'Rue Sainte-Anne',
  'Rue St. Anne': 'Rue Sainte-Anne',
  'St Eustache': 'Rue Saint-Eustache',
  'St. Eustache': 'Rue Saint-Eustache',
  'Rue St. Hubert': 'Rue Saint-Hubert',
  'Jean Talon': 'Rue Jean-Talon'
};
