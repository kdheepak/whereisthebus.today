# -*- coding: utf-8 -*-

from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask_login import login_required, login_user, logout_user

import json

blueprint = Blueprint('api', __name__, url_prefix='/api', static_folder='../static')


@blueprint.route('/routes', methods=['GET', 'POST'])
def transit_routes():
    json_data = [
      { 'value': 'one', 'label': 'One' },
      { 'value': 'two', 'label': 'Two' },
      { 'value': 'two', 'label': 'Two' },
    ]

    return json.dumps(json_data)


