/***************************
 * Author: Runquan Ye
 **************************/
 
<template>
  <div>
    <h2>Runquan Ye</h2>
    <div class="container">
      <v-form>
        <v-text-field label="Description" type="text" v-model="expenseDesc" />
        <v-text-field label="Amount" type="number" v-model.number="expenseAmt" step="0.01" />
        <v-menu
          ref="menu1"
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          full-width
          max-width="290px"
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="dateFormatted"
              label="Date"
              @blur="date = parseDate(dateFormatted)"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
        </v-menu>
        <v-select v-model="expenseCategory" v-bind:items="expenseCategories" label="Category"></v-select>
        <span>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn color="primary" @click="yourButtonHandler" v-on="on">Add</v-btn>
            </template>
            <span>Insert budget</span>
          </v-tooltip>
        </span>
      </v-form>
    </div>

    <div>
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <v-btn
            id="removeButton"
            color="green lighten-1"
            @click="removeSelection"
            v-on="on"
            v-bind:disabled="userSelections.length == 0"
          >Remove Selection(s)</v-btn>
        </template>
        <span>Remove Budget(s)</span>
      </v-tooltip>

      <v-simple-table fixed-header class="dataTable">
        <thead>
          <tr>
            <td>Date</td>
            <td>Description</td>
            <td>Category</td>
            <td>Amount</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(myExpense,pos) in myExpense" :key="pos">
            <td>{{myExpense.date}}</td>
            <td>{{myExpense.description}}</td>
            <td>{{myExpense.category}}</td>
            <td class="text-right">{{myExpense.amount.toFixed(2)}}</td>
            <td>
              <input type="checkbox" v-bind:id="myExpense.mykey" v-on:change="selectionHandler" />
            </td>
          </tr>
          <tr id="sum">
            <td colspan="3">Total</td>
            <td class="text-right">{{totalExpense.toFixed(2)}}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
    <v-container>
      <canvas id="myChart"></canvas>
    </v-container>
  </div>
</template>

<script>
import { AppDB } from "../db-init.js";

export default {
  data: function() {
    return {
      expenseDesc: "",
      expenseAmt: 0,
      expenseDate: "",
      expenseCategory: "",
      myExpense: [],
      totalExpense: 0,
      userSelections: [],
      expenseCategories: ["Food", "Gas", "Travel", "Education", "Clothing"],
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false
    };
  },
  mounted() {
    AppDB.ref("budget").on("child_added", this.fbAddHandler);
    AppDB.ref("budget").on("child_removed", this.fbRemoveListener);
  },
  beforeDestroy() {
    AppDB.ref("budget").off("child_added", this.fbAddHandler);
    AppDB.ref("budget").off("child_removed", this.fbRemoveListener);
  },
  computed: {
    computedDateFormatted() {
      return this.formatDate(this.date);
    }
  },

  watch: {
    date() {
      this.dateFormatted = this.formatDate(this.date);
    }
  },
  methods: {
    yourButtonHandler() {
      AppDB.ref("budget")
        .push()
        .set({
          description: this.expenseDesc,
          category: this.expenseCategory,
          amount: this.expenseAmt,
          date: this.date
        });
    },

    fbAddHandler(snapshot) {
      const item = snapshot.val();
      this.myExpense.push({ ...item, mykey: snapshot.key });

      // accumulate the total
      this.totalExpense += item.amount;
    },

    selectionHandler(changeEvent) {
      // The ID of the checkbox is also the key of the record in Firebase
      const whichKey = changeEvent.target.id;
      if (changeEvent.target.checked) {
        /* add the selected key to the array */
        this.userSelections.push(whichKey);
      } else {
        /* remove the deselected key from the array */
        this.userSelections = this.userSelections.filter(t =>
          t.localeCompare(whichKey)
        );
      }
    },
    fbRemoveListener(snapshot) {
      /* snapshot.key will hold the key of the item being REMOVED */
      const item = snapshot.val();
      this.myExpense = this.myExpense.filter(t => t.mykey !== snapshot.key);
      this.userSelections = [];

      // accumulate the total
      this.totalExpense -= item.amount;
    },
    removeSelection() {
      this.userSelections.forEach(victimKey => {
        AppDB.ref("budget")
          .child(victimKey)
          .remove();
      });
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${year}/${month}/${day}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  }
};
</script>

<style scoped>
.container form {
  margin-top: 2em;
  margin-bottom: 0.5em;
  padding: 0.5em;
  width: 16em;
  font: 16px sans-serif;
  border: 2px solid gray;
  border-radius: 2mm;
  display: grid;
  grid-template-rows: repeat(5, auto);
  grid-gap: 1mm;
}

.container span {
  text-align: right;
}

span > button {
  position: relative;
}

#removeButton {
  margin: 0.5em 2.5em 0;
}

.dataTable {
  width: 30em;
  margin: 0.5em 2.5em 0;
  padding: 2px;
  border: 2px solid rgb(165, 77, 74);
}

.dataTable td {
  padding: 2px;
}

thead th td {
  background: rgb(95, 82, 25);
  text-align: center;
  font-weight: bold;
  color: white;
}

tbody tr:nth-child(even) > td {
  background: rgb(237, 205, 71);
}
tbody tr:nth-child(odd) > td {
  background: rgb(246, 230, 147);
}

tbody > tr > td:first-child {
  text-align: center;
}

tbody > tr > td:last-child {
  /* text-align: right; */
  color: red;
}
#sum > td {
  background: white;
}

#sum > td:first-child {
  text-align: right;
  font-weight: bold;
}
</style>
