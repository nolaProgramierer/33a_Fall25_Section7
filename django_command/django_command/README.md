# Creating a Django Management Command
### You can create your own Django *manage.py* command
#### This can be useful if you need to download data once, or a few times, from an API and have it automatically populate your database

Let's say you're building an app where you want to have data from an external API populated in your database.  Instead of using JavaScript on the front-end you can use Django management commands to run a custom script. We can do this in Django by using the Python *requests* module and the Django *BaseCommand* class from *django.core.management.base*.  With these we can write a class which can query an external API, return the data, and write it to the database.  All from within Django.

To demonstrate this, I'll use a public API, [Nationalize.io](https://nationalize.io/documentation).  This API returns data that estimates the nationality of a given name.  I've chosen this API as it returns a simple object which is easily mapped to the Nationality model I've defiined in *models.py*.

```

Request
https://api.nationalize.io/?name=johnson
Response
{
    "count": 718863,
    "name": "johnson",
    "country": [
        {
            "country_id": "US",
            "probability": 0.114
        },
        {
            "country_id": "NG",
            "probability": 0.066
        },
        {
            "country_id": "JM",
            "probability": 0.059
        },
        {
            "country_id": "GH",
            "probability": 0.05
        },
        {
            "country_id": "GB",
            "probability": 0.05
        }
    ]
}

```

Assuming that you have a newly scaffolded Django app here are the steps.

1. Within your app, make a folder named *management*.
2. Within the *management* folder make a folder named *commands*
3. Within the *commands* folder make a file in which you'll define your custom command. e.g. *<my_custom_command.py>*
4. Django will know where to look for the commands when you type the command in the terminal.

In *import_api_data.py* is the code for downloading data from this API and having it automatically populate the database. 

### To run the command
*python manage.py import_api_data*  

I've commented the *management/commands/import_api_data.py* file to explain the steps.

If this method of downloading data is of benefit feel free to use any part of the code for your final project.


