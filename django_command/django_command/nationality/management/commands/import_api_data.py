import requests
import json
from django.core.management.base import BaseCommand
from nationality.models import Nationality

class Command(BaseCommand):
    # Document the command (available in terminal '-h')
    help = 'Fetch and populate nationality data from an API'

    # Function which runs when command is called
    def handle(self, *args, **options):
        name = "Randle"
        api_url = f"https://api.nationalize.io/?name={name}"
        response = requests.get(api_url)

        if response.status_code == 200:
            # Convert HTTP response to python object
            data = response.json()
            self.populate_nationality(data)
            
            # Write message to terminal
            self.stderr.write(self.style.SUCCESS('Successfully populated data'))
        else:
            self.stdout.write(self.style.ERROR("Failed to fetch data"))

    def populate_nationality(self, data):
        country_data = data.get("country", [])

        # Output to terminal for demo purposes
        country_data_str = json.dumps(country_data, indent=4)
        print(country_data_str)
       
        for item in country_data:
            country_id = item.get("country_id")
            probability = item.get("probability")

            # Check for valid probability number
            try:
                probability = float(probability)
            except (TypeError, ValueError):
                self.stdout.write(self.style.WARNING(f"Invalid probability for country {country_id}"))
                continue
            
            # Create or update a record for the database
            _, created = Nationality.objects.update_or_create(
                # Lookup argument; if exists, update, if not, create
                country_id = country_id,
                # Fields to update
                defaults = {"probability": probability}
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f"Added {country_id}"))
            else:
                self.stdout.write(self.style.SUCCESS(f"Updated {country_id}"))
