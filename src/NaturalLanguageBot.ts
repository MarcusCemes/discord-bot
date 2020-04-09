import { Client, Message } from "discord.js";

import { BayesClassifier } from "natural";

export class NaturalLanguageBot {
  public client = new Client();

  private id?: string;
  private classifier = new BayesClassifier();

  /**
   * Train the internal message classifier with a set of stems and associated text
   * The classifier will return the list of stems with an associated probability
   */
  public async train(documents: {
    [stem: string]: string | string[];
  }): Promise<void> {
    return new Promise(resolve => {
      // Start listening for training completion
      this.classifier.events.once("doneTraining", resolve);

      // Add all documents to the classifier
      for (const [stem, text] of Object.entries(documents)) {
        // @ts-ignore - overload error
        this.classifier.addDocument(text, stem);
      }

      // Star the training process
      this.classifier.train();
    });
  }

  /** Open up a realtime connection to Discord's servers */
  public async connect(token: string) {
    await this.client.login(token);
    this.id = this.client.user!.id;
  }

  /** Destroy the Discord connection */
  public destroy() {
    this.client.destroy();
    this.client.on
  }
}
